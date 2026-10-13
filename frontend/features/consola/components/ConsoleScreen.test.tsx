import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setViewport } from '../../../vitest.viewport';
import { ConsoleApiContext } from '../api/ConsoleApiContext';
import { createFakeApi, fail, ok, type FakeApi } from '../testing/fakeApi';
import { SESSION, detail, manyRows, summaryRow } from '../testing/fixtures';
import { ConsoleApp } from './ConsoleApp';
import { ConsoleScreen } from './ConsoleScreen';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
});
afterEach(() => vi.useRealTimers());

const withApi = (api: FakeApi, node: React.ReactNode) => (
  <ConsoleApiContext.Provider value={api}>{node}</ConsoleApiContext.Provider>
);
const screenOf = (api: FakeApi) => render(withApi(api, <ConsoleScreen session={SESSION} onSignOut={() => {}} />));
const list = () => screen.queryByRole('list', { name: 'Conversaciones' });
const row = (id: string) =>
  within(screen.getByRole('list', { name: 'Conversaciones' }))
    .getAllByRole('button')
    .find((button) => button.dataset.conversationId === id) as HTMLElement;

describe('Interfaz de la consola', () => {
  it('Escritorio', async () => {
    screenOf(createFakeApi());

    expect(await screen.findByRole('heading', { name: 'Resumen de octubre 2026' })).toBeInTheDocument();
    expect(await screen.findByRole('list', { name: 'Conversaciones' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Conversación' })).toHaveTextContent('Elija una conversación de la bandeja.');
  });

  it('Lector en escritorio', async () => {
    window.history.replaceState(null, '', '/consola?c=c2');
    screenOf(createFakeApi());

    const messages = await screen.findByText('Hola, ¿a qué hora abren?');
    expect(list()).toBeInTheDocument();
    const items = within(messages.closest('ol') as HTMLElement).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('VISITANTE');
    expect(items[1]).toHaveTextContent('ASISTENTE');
    expect(items[1]).toHaveClass('border-marca');
  });

  it('Móvil', async () => {
    setViewport('mobile');
    const api = createFakeApi();
    screenOf(api);
    await screen.findByRole('list', { name: 'Conversaciones' });

    await userEvent.setup().click(row('c2'));

    expect(list()).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Resumen de/ })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Conversación' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
    expect(await screen.findByText('Hola, ¿a qué hora abren?')).toBeInTheDocument();
  });

  it('Volver en móvil', async () => {
    setViewport('mobile');
    screenOf(createFakeApi());
    await screen.findByRole('list', { name: 'Conversaciones' });
    const user = userEvent.setup();
    await user.click(row('c2'));

    await user.click(screen.getByRole('button', { name: 'Volver' }));

    expect(await screen.findByRole('list', { name: 'Conversaciones' })).toBeInTheDocument();
    expect(window.location.search).toBe('');
    await waitFor(() => expect(row('c2')).toHaveFocus());
  });

  it('closes the reader with Esc on mobile and returns the focus to the row', async () => {
    setViewport('mobile');
    screenOf(createFakeApi());
    await screen.findByRole('list', { name: 'Conversaciones' });
    const user = userEvent.setup();
    await user.click(row('c3'));

    await user.keyboard('{Escape}');

    expect(await screen.findByRole('list', { name: 'Conversaciones' })).toBeInTheDocument();
    await waitFor(() => expect(row('c3')).toHaveFocus());
  });

  it('moves the focus to the reader title when a row is opened on mobile', async () => {
    setViewport('mobile');
    screenOf(createFakeApi());
    await screen.findByRole('list', { name: 'Conversaciones' });
    await userEvent.setup().click(row('c1'));
    const title = await screen.findByRole('heading', { name: '+593 ••• ••• 001' });
    await waitFor(() => expect(title).toHaveFocus());
  });

  it('moves the focus to the reader on desktop and Esc brings it back to the row', async () => {
    screenOf(createFakeApi());
    await screen.findByRole('list', { name: 'Conversaciones' });
    const user = userEvent.setup();
    await user.click(row('c2'));
    const title = await screen.findByRole('heading', { name: '+593 ••• ••• 002' });
    await waitFor(() => expect(title).toHaveFocus());
    expect(list()).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(row('c2')).toHaveFocus();
  });

  it('keeps the list and the reader apart: j does not pull the focus into the reader', async () => {
    window.history.replaceState(null, '', '/consola?c=c1');
    screenOf(createFakeApi());
    await screen.findByText('Hola, ¿a qué hora abren?');
    act(() => row('c1').focus());
    await userEvent.setup().keyboard('j');
    expect(row('c2')).toHaveFocus();
  });
});

describe('Caducidad de la sesión', () => {
  function sessionApi() {
    const rows = [
      summaryRow('c1', { channel: 'whatsapp', contact: '+593 ••• ••• 001' }),
      summaryRow('c2', { channel: 'whatsapp', contact: '+593 ••• ••• 002' }),
    ];
    const getConversation = vi.fn(async (id: string) =>
      id === 'c2' ? fail<ReturnType<typeof detail>>('unauthorized', { status: 401 }) : ok(detail(id)),
    );
    return createFakeApi({
      listConversations: async () => ok({ items: rows, nextCursor: null }),
      getConversation,
    });
  }

  async function expireOnC2(api: FakeApi) {
    window.history.replaceState(null, '', '/consola?canal=whatsapp&c=c1');
    render(withApi(api, <ConsoleApp />));
    await screen.findByText('Hola, ¿a qué hora abren?');
    await userEvent.setup().click(row('c2'));
    return await screen.findByLabelText('Usuario');
  }

  it('401 a mitad de sesión', async () => {
    const api = sessionApi();
    await expireOnC2(api);

    expect(screen.getByRole('alert')).toHaveTextContent('Su sesión caducó. Vuelva a entrar.');
    expect(document.body).not.toHaveTextContent('Hola, ¿a qué hora abren?');
    expect(document.body).not.toHaveTextContent('+593');
    expect(screen.queryByRole('list', { name: 'Conversaciones' })).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/consola');
    expect(new URLSearchParams(window.location.search).get('canal')).toBe('whatsapp');
    expect(new URLSearchParams(window.location.search).get('c')).toBe('c2');
  });

  it('Vuelta tras caducar', async () => {
    const api = sessionApi();
    api.getConversation.mockImplementation(async (id: string) => (id === 'c2' && api.getConversation.mock.calls.filter(([x]) => x === 'c2').length === 1 ? fail('unauthorized', { status: 401 }) : ok(detail(id))));
    await expireOnC2(api);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Usuario'), 'demo');
    await user.type(screen.getByLabelText('Clave'), 'consola-demo');
    await user.type(screen.getByLabelText('Código'), '123456');

    await waitFor(() => expect(screen.getByLabelText('Canal')).toHaveValue('whatsapp'));
    expect(api.listConversations).toHaveBeenLastCalledWith(
      expect.objectContaining({ channel: 'whatsapp' }),
      expect.any(AbortSignal),
    );
    await waitFor(() => expect(api.getConversation).toHaveBeenLastCalledWith('c2', expect.any(AbortSignal)));
    expect(row('c2')).toHaveAttribute('aria-current', 'true');
  });
});

describe('Nombres accesibles', () => {
  it('names every control of the mounted console', async () => {
    const rows = manyRows(3);
    window.history.replaceState(null, '', '/consola?c=c1');
    const api = createFakeApi({ listConversations: async () => ok({ items: rows, nextCursor: 'siguiente' }) });
    const { container } = screenOf(api);
    await screen.findByText('Hola, ¿a qué hora abren?');
    await screen.findByText('CHATS');

    const controls = container.querySelectorAll<HTMLElement>('button, input, select, [tabindex]');
    expect(controls.length).toBeGreaterThan(8);
    for (const control of controls) expect(control).toHaveAccessibleName();
    expect(screen.getByRole('combobox', { name: 'Tenant' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Canal' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Mes' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Solo listos para llamada' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cargar más' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Chats por día de octubre 2026' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Lista de conversaciones' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Conversación' })).toBeInTheDocument();
  });
});
