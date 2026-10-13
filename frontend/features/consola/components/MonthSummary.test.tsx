import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsoleApiContext } from '../api/ConsoleApiContext';
import { createFakeApi, deferred, fail, ok } from '../testing/fakeApi';
import { SESSION, summaryOf } from '../testing/fixtures';
import { renderWithApi } from '../testing/render';
import type { MonthSummary as MonthSummaryData } from '../types';
import { ConsoleScreen } from './ConsoleScreen';
import { MonthSummary } from './MonthSummary';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
});
afterEach(() => vi.useRealTimers());

const mount = (api: ReturnType<typeof createFakeApi>, props: Partial<Parameters<typeof MonthSummary>[0]> = {}) =>
  renderWithApi(
    <MonthSummary
      month="2026-10"
      tenants={SESSION.tenants}
      headingRef={createRef()}
      onMonthChange={() => {}}
      {...props}
    />,
    api,
  );

describe('MonthSummary', () => {
  it('Cifras en la interfaz', async () => {
    const api = createFakeApi({
      getSummary: async () =>
        ok(summaryOf('2026-10', [3, 0, 7], { conversations: 48, replies: 1234, costUsd: 1.8432, readyForCall: 5 })),
    });
    mount(api);

    expect(await screen.findByRole('heading', { name: 'Resumen de octubre 2026' })).toBeInTheDocument();
    const figures = await screen.findByText('CHATS');
    const list = figures.closest('dl') as HTMLElement;
    const pairs = within(list)
      .getAllByRole('term')
      .map((term) => [term.textContent, term.nextElementSibling?.textContent]);
    expect(pairs).toEqual([
      ['CHATS', '48'],
      ['RESPUESTAS', '1.234'],
      ['COSTO (USD)', '1,84'],
      ['LISTOS PARA LLAMADA', '5'],
    ]);
  });

  it('names the active filter under the figures', async () => {
    mount(createFakeApi(), { tenantId: 'aiworks', channel: 'whatsapp' });
    expect(await screen.findByText('AIworks · WhatsApp')).toBeInTheDocument();
  });

  it('says all tenants and channels when there is no filter', async () => {
    mount(createFakeApi());
    expect(await screen.findByText('Todos los tenants y canales')).toBeInTheDocument();
  });

  it('asks for the summary with the filters of the screen', async () => {
    const api = createFakeApi();
    mount(api, { month: '2026-09', tenantId: 'demo-panaderia', channel: 'web' });
    await screen.findByText('CHATS');
    expect(api.getSummary).toHaveBeenCalledWith(
      { month: '2026-09', tenantId: 'demo-panaderia', channel: 'web' },
      expect.any(AbortSignal),
    );
  });

  it('offers the last twelve months with the current one first', () => {
    mount(createFakeApi());
    const options = within(screen.getByLabelText('Mes')).getAllByRole('option');
    expect(options).toHaveLength(12);
    expect(options[0]).toHaveTextContent('octubre 2026');
    expect(options[11]).toHaveTextContent('noviembre 2025');
  });

  it('Estados del resumen', async () => {
    const first = deferred<ReturnType<typeof ok<MonthSummaryData>>>();
    const getSummary = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce(fail('server', { status: 500 }))
      .mockResolvedValueOnce(ok(summaryOf('2026-10', [1])));
    const api = createFakeApi({ getSummary });
    const view = mount(api);

    expect(screen.getByRole('region', { name: 'Resumen de octubre 2026' })).toHaveAttribute('aria-busy', 'true');

    await act(async () => first.resolve(ok(summaryOf('2026-10', [], { conversations: 0, replies: 0, costUsd: 0, readyForCall: 0 }))));
    expect(screen.getByText('Sin datos en octubre 2026.')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Resumen de octubre 2026' })).toHaveAttribute('aria-busy', 'false');

    view.rerender(
      <ConsoleApiContext.Provider value={api}>
        <MonthSummary month="2026-10" tenantId="aiworks" tenants={SESSION.tenants} headingRef={createRef()} onMonthChange={() => {}} />
      </ConsoleApiContext.Provider>,
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('La API devolvió un error.');

    await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).click(screen.getByRole('button', { name: 'Reintentar' }));
    await waitFor(() => expect(getSummary).toHaveBeenCalledTimes(3));
    expect(await screen.findByText('CHATS')).toBeInTheDocument();
  });

  it('shows the rate limit wait and brings the retry button back when it ends', async () => {
    vi.useRealTimers();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
    const api = createFakeApi({
      getSummary: async () => fail('rate_limited', { status: 429, retryAfterSeconds: 30 }),
    });
    mount(api, { tenantId: 'demo-limite' });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Demasiadas peticiones. Espere 30 s.');
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('shows the timeout text', async () => {
    mount(createFakeApi({ getSummary: async () => fail('timeout') }));
    expect(await screen.findByRole('alert')).toHaveTextContent('La API tardó demasiado en responder.');
  });
});

describe('MonthSummary inside the console', () => {
  it('Cambio de mes', async () => {
    const api = createFakeApi();
    render(
      <ConsoleApiContext.Provider value={api}>
        <ConsoleScreen session={SESSION} onSignOut={() => {}} />
      </ConsoleApiContext.Provider>,
    );
    await screen.findByText('CHATS');

    await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).selectOptions(screen.getByLabelText('Mes'), 'septiembre 2026');

    expect(await screen.findByRole('heading', { name: 'Resumen de septiembre 2026' })).toBeInTheDocument();
    expect(api.getSummary).toHaveBeenLastCalledWith({ month: '2026-09', tenantId: undefined, channel: undefined }, expect.any(AbortSignal));
    expect(window.location.search).toContain('mes=2026-09');
  });
});
