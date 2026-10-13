import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConsoleApiContext } from '../api/ConsoleApiContext';
import { createFakeApi, deferred, fail, ok } from '../testing/fakeApi';
import { SESSION, detail } from '../testing/fixtures';
import type { ConversationDetail } from '../types';
import { ConversationReader } from './ConversationReader';

function mount(api: ReturnType<typeof createFakeApi>, id: string | null = 'c1', onBack?: () => void) {
  const headingRef = createRef<HTMLHeadingElement>();
  const view = render(
    <ConsoleApiContext.Provider value={api}>
      <ConversationReader id={id ?? undefined} tenants={SESSION.tenants} headingRef={headingRef} onBack={onBack} />
    </ConsoleApiContext.Provider>,
  );
  return { ...view, headingRef };
}

const withDetail = (overrides: Partial<ConversationDetail> = {}) =>
  createFakeApi({ getConversation: async (id) => ok(detail(id, overrides)) });

describe('ConversationReader', () => {
  it('asks to pick a conversation when none is open', () => {
    mount(createFakeApi(), null);
    expect(screen.getByText('Elija una conversación de la bandeja.')).toBeInTheDocument();
  });

  it('Lector: one list item per message with the speaker label, time and the petroleum rule for the assistant', async () => {
    const { container } = mount(withDetail());
    await screen.findByText('Hola, ¿a qué hora abren?');
    const items = within(container.querySelector('ol') as HTMLElement).getAllByRole('listitem');

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('VISITANTE · 10:04');
    expect(items[0]).toHaveTextContent('Hola, ¿a qué hora abren?');
    expect(items[1]).toHaveTextContent('ASISTENTE · 10:04');
    expect(items[1]).toHaveClass('border-marca');
    expect(items[0]).not.toHaveClass('border-marca');
  });

  it('shows the contact, tenant, channel, language and turns in the header', async () => {
    mount(withDetail({ contact: 'web · a1b2c3', channel: 'web', tenantId: 'demo-panaderia', language: 'en', turns: 7 }));
    expect(await screen.findByRole('heading', { name: 'web · a1b2c3' })).toBeInTheDocument();
    expect(screen.getByText('Panadería Sol · WEB · EN · 7 turnos')).toBeInTheDocument();
  });

  it('shows a dash when the language is unknown', async () => {
    mount(withDetail({ language: null }));
    expect(await screen.findByText(/· — ·/)).toBeInTheDocument();
  });

  it('lists the signals with their state in words', async () => {
    mount(withDetail());
    const signals = within(await screen.findByRole('region', { name: 'Conversación' })).getByText('Señales').closest('section') as HTMLElement;
    const rows = within(signals).getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('Necesidad clara');
    expect(rows[0]).toHaveTextContent('Alcanzada');
    expect(rows[1]).toHaveTextContent('Presupuesto');
    expect(rows[1]).toHaveTextContent('Pendiente');
  });

  it('Texto que parece HTML', async () => {
    const text = '<b>hola</b> https://ejemplo.test';
    const { container } = mount(
      withDetail({ messages: [{ speaker: 'visitor', text, at: '2026-10-12T15:04:09Z' }] }),
    );
    const message = await screen.findByText(text);
    expect(message).toBeInTheDocument();
    expect(container.querySelector('b')).toBeNull();
    expect(container.querySelector('li a')).toBeNull();
  });

  it('keeps line breaks and wraps long words', async () => {
    mount(withDetail({ messages: [{ speaker: 'visitor', text: 'uno\ndos', at: '2026-10-12T15:04:09Z' }] }));
    const paragraph = await screen.findByText(/uno/);
    expect(paragraph).toHaveClass('whitespace-pre-wrap');
    expect(paragraph.className).toContain('overflow-wrap:anywhere');
    expect(paragraph.textContent).toBe('uno\ndos');
  });

  it('Detalle no encontrado', async () => {
    mount(createFakeApi({ getConversation: async () => fail('not_found', { status: 404 }) }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Esta conversación ya no existe. Puede haberse borrado por antigüedad.',
    );
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument();
  });

  it('shows the error with a retry button for other failures', async () => {
    const getConversation = vi.fn().mockResolvedValueOnce(fail('timeout')).mockResolvedValueOnce(ok(detail('c1')));
    mount(createFakeApi({ getConversation }));
    expect(await screen.findByRole('alert')).toHaveTextContent('La API tardó demasiado en responder.');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText('Hola, ¿a qué hora abren?')).toBeInTheDocument();
  });

  it('is busy while loading and drops the old conversation when another is opened', async () => {
    const first = deferred<ReturnType<typeof ok<ConversationDetail>>>();
    const signals: AbortSignal[] = [];
    const getConversation = vi.fn(async (id: string, signal?: AbortSignal) => {
      if (signal) signals.push(signal);
      return id === 'c1' ? first.promise : ok(detail(id, { messages: [{ speaker: 'visitor', text: 'segunda', at: '2026-10-12T15:04:09Z' }] }));
    });
    const api = createFakeApi({ getConversation });
    const headingRef = createRef<HTMLHeadingElement>();
    const tree = (id: string) => (
      <ConsoleApiContext.Provider value={api}>
        <ConversationReader id={id ?? undefined} tenants={SESSION.tenants} headingRef={headingRef} />
      </ConsoleApiContext.Provider>
    );
    const view = render(tree('c1'));
    expect(screen.getByText('Cargando…').closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');

    view.rerender(tree('c2'));
    expect(await screen.findByText('segunda')).toBeInTheDocument();
    expect(signals[0].aborted).toBe(true);

    await act(async () => first.resolve(ok(detail('c1', { messages: [{ speaker: 'visitor', text: 'primera tardía', at: '2026-10-12T15:04:09Z' }] }))));
    expect(screen.queryByText('primera tardía')).not.toBeInTheDocument();
  });

  it('Red de seguridad en la interfaz: the reader hides a full phone number', async () => {
    mount(withDetail({ contact: '+593 99 000 0000' }));
    expect(await screen.findByRole('heading', { name: 'Contacto oculto' })).toBeInTheDocument();
    expect(screen.queryByText(/000 0000/)).not.toBeInTheDocument();
  });

  it('shows a "Volver" text button only when asked to', async () => {
    const onBack = vi.fn();
    mount(withDetail(), 'c1', onBack);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Volver' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('has no back button by default', async () => {
    mount(withDetail());
    await screen.findByText('Hola, ¿a qué hora abren?');
    expect(screen.queryByRole('button', { name: 'Volver' })).not.toBeInTheDocument();
  });
});
