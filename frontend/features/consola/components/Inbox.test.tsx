import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { setViewport } from '../../../vitest.viewport';
import { ConsoleApiContext } from '../api/ConsoleApiContext';
import { createFakeApi, deferred, fail, ok, type FakeApi } from '../testing/fakeApi';
import { SESSION, manyRows, summaryRow } from '../testing/fixtures';
import type { ConversationPage } from '../types';
import { ConsoleScreen } from './ConsoleScreen';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
});
afterEach(() => vi.useRealTimers());

function mount(api: FakeApi) {
  return render(
    <ConsoleApiContext.Provider value={api}>
      <ConsoleScreen session={SESSION} onSignOut={() => {}} />
    </ConsoleApiContext.Provider>,
  );
}

const page = (items = manyRows(3), nextCursor: string | null = null): ConversationPage => ({ items, nextCursor });
const rowButtons = () => within(screen.getByRole('list', { name: 'Conversaciones' })).getAllByRole('button');
const rowOf = (id: string) => rowButtons().find((button) => button.dataset.conversationId === id) as HTMLElement;
const search = () => window.location.search;

describe('Lista de conversaciones', () => {
  it('Filtros en la interfaz', async () => {
    const api = createFakeApi();
    mount(api);
    await screen.findByRole('list', { name: 'Conversaciones' });
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText('Canal'), 'WhatsApp');
    await user.click(screen.getByLabelText('Solo listos para llamada'));

    await waitFor(() => {
      const query = api.listConversations.mock.lastCall?.[0] as unknown as Record<string, unknown>;
      expect(query).toMatchObject({ channel: 'whatsapp', readyOnly: true });
      expect(query.cursor).toBeUndefined();
    });
    expect(search()).toContain('canal=whatsapp');
    expect(search()).toContain('listas=1');
  });

  it('Cargar más', async () => {
    const listConversations = vi
      .fn()
      .mockResolvedValueOnce(ok(page(manyRows(20), 'abc')))
      .mockResolvedValueOnce(ok(page(manyRows(5).map((row) => ({ ...row, id: `d${row.id}` })), null)));
    const api = createFakeApi({ listConversations });
    mount(api);
    await screen.findByRole('list', { name: 'Conversaciones' });
    expect(rowButtons()).toHaveLength(20);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Cargar más' }));

    await waitFor(() => expect(rowButtons()).toHaveLength(25));
    expect(listConversations).toHaveBeenLastCalledWith(expect.objectContaining({ cursor: 'abc', month: '2026-10' }), expect.any(AbortSignal));
    expect(screen.queryByRole('button', { name: 'Cargar más' })).not.toBeInTheDocument();
  });

  it('keeps the loaded rows and shows the error under the list when "Cargar más" fails', async () => {
    const listConversations = vi
      .fn()
      .mockResolvedValueOnce(ok(page(manyRows(20), 'abc')))
      .mockResolvedValueOnce(fail('server', { status: 500 }))
      .mockResolvedValueOnce(ok(page(manyRows(2).map((row) => ({ ...row, id: `e${row.id}` })), null)));
    mount(createFakeApi({ listConversations }));
    await screen.findByRole('list', { name: 'Conversaciones' });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'Cargar más' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('La API devolvió un error.');
    expect(rowButtons()).toHaveLength(20);

    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    await waitFor(() => expect(rowButtons()).toHaveLength(22));
  });

  it('starts the list again once when the cursor is rejected', async () => {
    const listConversations = vi
      .fn()
      .mockResolvedValueOnce(ok(page(manyRows(20), 'viejo')))
      .mockResolvedValueOnce(fail('invalid_request', { status: 422, code: 'cursor_invalido' }))
      .mockResolvedValueOnce(ok(page(manyRows(3), null)));
    mount(createFakeApi({ listConversations }));
    await screen.findByRole('list', { name: 'Conversaciones' });

    await userEvent.setup().click(screen.getByRole('button', { name: 'Cargar más' }));

    await waitFor(() => expect(rowButtons()).toHaveLength(3));
    expect(listConversations).toHaveBeenCalledTimes(3);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('Vacío con filtros', async () => {
    window.history.replaceState(null, '', '/consola?tenant=demo-taller');
    mount(createFakeApi({ listConversations: async () => ok(page([])) }));

    expect(
      await screen.findByText('Aún no hay conversaciones en octubre 2026 con estos filtros: Taller Ejemplo.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Tenant')).toHaveValue('demo-taller');

    await userEvent.setup().click(screen.getByRole('button', { name: 'Quitar filtros' }));

    expect(screen.getByLabelText('Tenant')).toHaveValue('');
    expect(screen.getByLabelText('Canal')).toHaveValue('');
    expect(search()).not.toContain('tenant');
  });

  it('shows the plain empty message, without a button, when there are no filters', async () => {
    mount(createFakeApi({ listConversations: async () => ok(page([])) }));
    expect(await screen.findByText('Aún no hay conversaciones en octubre 2026.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Quitar filtros' })).not.toBeInTheDocument();
  });

  it('shows the error with a retry button', async () => {
    const listConversations = vi
      .fn()
      .mockResolvedValueOnce(fail('network'))
      .mockResolvedValueOnce(ok(page()));
    mount(createFakeApi({ listConversations }));

    const region = await screen.findByRole('region', { name: 'Lista de conversaciones' });
    expect(await within(region).findByRole('alert')).toHaveTextContent('No hay conexión con la API.');
    await userEvent.setup().click(within(region).getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByRole('list', { name: 'Conversaciones' })).toBeInTheDocument();
  });

  it('marks the zone busy while loading', async () => {
    const pending = deferred<ReturnType<typeof ok<ConversationPage>>>();
    mount(createFakeApi({ listConversations: () => pending.promise }));
    const zone = screen.getByRole('region', { name: 'Bandeja de conversaciones' });
    expect(zone).toHaveAttribute('aria-busy', 'true');
    expect(within(zone).getByText('Cargando…')).toBeInTheDocument();
    await act(async () => pending.resolve(ok(page())));
    expect(zone).toHaveAttribute('aria-busy', 'false');
  });

  it('Respuesta tardía', async () => {
    const web = deferred<ReturnType<typeof ok<ConversationPage>>>();
    const signals: AbortSignal[] = [];
    const listConversations = vi.fn(async (query: { channel?: string }, signal?: AbortSignal) => {
      if (signal) signals.push(signal);
      if (query.channel === 'web') return web.promise;
      if (query.channel === 'whatsapp') return ok(page([summaryRow('w1', { channel: 'whatsapp' })]));
      return ok(page());
    });
    window.history.replaceState(null, '', '/consola?canal=web');
    mount(createFakeApi({ listConversations }));
    await waitFor(() => expect(listConversations).toHaveBeenCalledTimes(1));

    await userEvent.setup().selectOptions(screen.getByLabelText('Canal'), 'WhatsApp');
    await waitFor(() => expect(rowButtons()).toHaveLength(1));
    expect(signals[0].aborted).toBe(true);

    await act(async () => web.resolve(ok(page([summaryRow('late-web', { channel: 'web' })]))));
    expect(rowButtons()).toHaveLength(1);
    expect(rowOf('w1')).toBeInTheDocument();
    expect(screen.queryByText(/late-web/)).not.toBeInTheDocument();
  });

  it('shows month, tenant, channel and signals on each row', async () => {
    mount(
      createFakeApi({
        listConversations: async () =>
          ok(page([summaryRow('c1', { tenantId: 'demo-panaderia', channel: 'web', contact: 'web · a1b2c3', turns: 1, readyForCall: true, signalsReached: 4, signalsTotal: 4 })])),
      }),
    );
    const row = within(await screen.findByRole('list', { name: 'Conversaciones' })).getByRole('button');
    expect(row).toHaveTextContent('12 oct · 10:04 · Panadería Sol · WEB');
    expect(row).toHaveTextContent('web · a1b2c3');
    expect(row).toHaveTextContent('1 turno');
    expect(within(row).getByLabelText('4 de 4 señales')).toHaveTextContent('4/4');
    expect(row).toHaveTextContent('Listo para llamada');
  });

  it('marks the selected row with Arena, a petroleum rule and aria-current', async () => {
    window.history.replaceState(null, '', '/consola?c=c2');
    mount(createFakeApi());
    await screen.findByRole('list', { name: 'Conversaciones' });

    expect(rowOf('c2')).toHaveAttribute('aria-current', 'true');
    expect(rowOf('c2')).toHaveClass('bg-arena', 'border-marca');
    expect(rowOf('c1')).not.toHaveAttribute('aria-current');
    expect(rowOf('c1')).not.toHaveClass('bg-arena');
  });

  it('opens a conversation with a click', async () => {
    mount(createFakeApi());
    await screen.findByRole('list', { name: 'Conversaciones' });
    await userEvent.setup().click(rowOf('c3'));
    expect(search()).toBe('?c=c3');
    expect(rowOf('c3')).toHaveAttribute('aria-current', 'true');
  });

  it('Mes anterior: asks for that month and shows an empty list', async () => {
    window.history.replaceState(null, '', '/consola?mes=2026-09');
    const api = createFakeApi({ listConversations: async () => ok(page([])) });
    mount(api);
    expect(await screen.findByText('Aún no hay conversaciones en septiembre 2026.')).toBeInTheDocument();
    expect(api.listConversations).toHaveBeenCalledWith(expect.objectContaining({ month: '2026-09' }), expect.any(AbortSignal));
  });
});

describe('Teléfonos enmascarados', () => {
  it('Red de seguridad en la interfaz: the row shows "Contacto oculto"', async () => {
    mount(
      createFakeApi({
        listConversations: async () => ok(page([summaryRow('c_numero', { contact: '+593 99 000 0000' })])),
      }),
    );
    const row = within(await screen.findByRole('list', { name: 'Conversaciones' })).getByRole('button');
    expect(row).toHaveTextContent('Contacto oculto');
    expect(row).not.toHaveTextContent('000 0000');
  });
});

describe('Navegación por teclado', () => {
  async function ready(initial = '/consola?c=c1') {
    window.history.replaceState(null, '', initial);
    const api = createFakeApi();
    mount(api);
    await screen.findByRole('list', { name: 'Conversaciones' });
    return { api, user: userEvent.setup() };
  }

  it('Siguiente conversación en escritorio', async () => {
    const { api, user } = await ready();
    act(() => rowOf('c1').focus());

    await user.keyboard('j');

    expect(rowOf('c2')).toHaveFocus();
    expect(rowOf('c2')).toHaveAttribute('aria-current', 'true');
    expect(rowOf('c1')).not.toHaveAttribute('aria-current');
    expect(api.getConversation).toHaveBeenCalledWith('c2', expect.any(AbortSignal));
    expect(search()).toBe('?c=c2');
  });

  it('works backwards with k and with the arrow keys', async () => {
    const { user } = await ready('/consola?c=c3');
    act(() => rowOf('c3').focus());
    await user.keyboard('k');
    expect(rowOf('c2')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(rowOf('c1')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(rowOf('c2')).toHaveFocus();
    expect(search()).toBe('?c=c2');
  });

  it('Bordes de la lista', async () => {
    const { user } = await ready();
    act(() => rowOf('c1').focus());
    await user.keyboard('k');
    expect(rowOf('c1')).toHaveFocus();
    expect(search()).toBe('?c=c1');

    act(() => rowOf('c3').focus());
    await user.keyboard('j');
    expect(rowOf('c3')).toHaveFocus();
    expect(search()).toBe('?c=c1');
  });

  it('Teclas dentro de un campo', async () => {
    const { user } = await ready();
    act(() => screen.getByLabelText('Canal').focus());
    await user.keyboard('j');
    expect(rowOf('c1')).toHaveAttribute('aria-current', 'true');
    expect(search()).toBe('?c=c1');
    expect(screen.getByLabelText('Canal')).toHaveFocus();
  });

  it('ignores the keys when a modifier is held', async () => {
    const { user } = await ready();
    act(() => rowOf('c1').focus());
    await user.keyboard('{Control>}j{/Control}');
    expect(rowOf('c1')).toHaveFocus();
  });

  it('Ir al resumen', async () => {
    const { user } = await ready();
    act(() => rowOf('c2').focus());
    await user.keyboard('gr');
    expect(screen.getByRole('heading', { name: 'Resumen de octubre 2026' })).toHaveFocus();
  });

  it('does not go to the summary when "r" comes without a recent "g"', async () => {
    const { user } = await ready();
    act(() => rowOf('c2').focus());
    await user.keyboard('r');
    expect(rowOf('c2')).toHaveFocus();
  });

  it('on mobile j only moves the focus and does not open the next conversation', async () => {
    setViewport('mobile');
    const { user } = await ready('/consola');
    act(() => rowOf('c1').focus());
    await user.keyboard('j');
    expect(rowOf('c2')).toHaveFocus();
    expect(search()).toBe('');
  });

  it('opens the focused row with Enter', async () => {
    const { user } = await ready('/consola');
    act(() => rowOf('c2').focus());
    await user.keyboard('{Enter}');
    expect(search()).toBe('?c=c2');
  });
});
