import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConsoleApp } from '../components/ConsoleApp';
import { formatMonth } from '../lib/format';
import { currentMonth } from '../lib/month';
import { createFakeApi, deferred, fail, ok } from '../testing/fakeApi';
import { SESSION } from '../testing/fixtures';
import { renderWithApi } from '../testing/render';
import type { SessionInfo } from '../types';

afterEach(() => vi.useRealTimers());

const summaryTitle = () => `Resumen de ${formatMonth(currentMonth())}`;

describe('Consola apagada por defecto', () => {
  it('La interfaz con la consola apagada', async () => {
    const api = createFakeApi({ getSession: async () => fail('not_found', { status: 404 }) });
    renderWithApi(<ConsoleApp />, api);

    expect(await screen.findByText('La consola no está activa.')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Clave')).not.toBeInTheDocument();
  });
});

describe('Guardia de la interfaz', () => {
  it('Comprobando sesión', () => {
    const pending = deferred<ReturnType<typeof ok<SessionInfo>>>();
    const api = createFakeApi({ getSession: () => pending.promise });
    renderWithApi(<ConsoleApp />, api);

    expect(screen.getByText('Comprobando sesión…')).toBeInTheDocument();
    expect(screen.queryByLabelText('Usuario')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: summaryTitle() })).not.toBeInTheDocument();
    expect(api.getSummary).not.toHaveBeenCalled();
    expect(api.listConversations).not.toHaveBeenCalled();
    expect(api.getConversation).not.toHaveBeenCalled();
  });

  it('Sin sesión', async () => {
    const api = createFakeApi({ getSession: async () => fail('unauthorized', { status: 401 }) });
    renderWithApi(<ConsoleApp />, api);

    expect(await screen.findByLabelText('Usuario')).toHaveFocus();
    expect(screen.getByLabelText('Clave')).toBeInTheDocument();
    expect(screen.getByLabelText('Código')).toBeInTheDocument();
  });

  it('API inalcanzable', async () => {
    const getSession = vi
      .fn()
      .mockResolvedValueOnce(fail('network'))
      .mockResolvedValueOnce(ok(SESSION));
    renderWithApi(<ConsoleApp />, createFakeApi({ getSession }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos contactar la API.');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('heading', { name: summaryTitle() })).toBeInTheDocument();
    expect(getSession).toHaveBeenCalledTimes(2);
  });
});

describe('Login', () => {
  it('Login correcto desde la interfaz', async () => {
    const api = createFakeApi({ getSession: async () => fail('unauthorized', { status: 401 }) });
    renderWithApi(<ConsoleApp />, api);
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText('Usuario'), 'demo');
    await user.type(screen.getByLabelText('Clave'), 'consola-demo');
    await user.type(screen.getByLabelText('Código'), '123456');

    expect(await screen.findByRole('heading', { name: summaryTitle() })).toBeInTheDocument();
    expect(api.login).toHaveBeenCalledTimes(1);
    expect(api.login).toHaveBeenCalledWith({ user: 'demo', password: 'consola-demo', code: '123456' });
    expect(api.getSession).toHaveBeenCalledTimes(1);
  });

  it('Salir returns to the login with the notice and clears the URL', async () => {
    window.history.replaceState(null, '', '/consola?canal=web&c=c1');
    const api = createFakeApi();
    renderWithApi(<ConsoleApp />, api);
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: 'Salir' }));

    expect(await screen.findByText('Sesión cerrada.')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(window.location.pathname + window.location.search).toBe('/consola');
    expect(api.logout).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('heading', { name: summaryTitle() })).not.toBeInTheDocument();
  });

  it('Salir signs out even if the request fails', async () => {
    const api = createFakeApi({ logout: async () => fail('network') });
    renderWithApi(<ConsoleApp />, api);

    await userEvent.setup().click(await screen.findByRole('button', { name: 'Salir' }));
    expect(await screen.findByText('Sesión cerrada.')).toBeInTheDocument();
  });
});

describe('Caducidad de la sesión', () => {
  it('Corte de inactividad en el cliente', async () => {
    vi.useFakeTimers();
    const api = createFakeApi();
    renderWithApi(<ConsoleApp />, api);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByRole('heading', { name: summaryTitle() })).toBeInTheDocument();
    const calls = Object.values(api).map((fn) => fn.mock.calls.length);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30 * 60_000 + 60_000);
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Su sesión caducó. Vuelva a entrar.');
    expect(screen.queryByRole('heading', { name: summaryTitle() })).not.toBeInTheDocument();
    expect(Object.values(api).map((fn) => fn.mock.calls.length)).toEqual(calls);
  });

  it('keeps the session while the tab is within the idle limit', async () => {
    vi.useFakeTimers();
    renderWithApi(<ConsoleApp />, createFakeApi());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(29 * 60_000);
    });
    expect(screen.getByRole('heading', { name: summaryTitle() })).toBeInTheDocument();
  });

  it('checks the idle limit when the tab becomes visible again', async () => {
    vi.useFakeTimers();
    renderWithApi(<ConsoleApp />, createFakeApi());
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    vi.setSystemTime(Date.now() + 40 * 60_000);
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Su sesión caducó. Vuelva a entrar.');
  });
});

describe('ConsoleApp without an injected API', () => {
  it('builds the real client and shows the login when the API answers 401', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: { codigo: 'sin_sesion', mensaje: 'x' } }), { status: 401 }),
    );
    render(<ConsoleApp />);
    await waitFor(() => expect(screen.getByLabelText('Usuario')).toBeInTheDocument());
    expect(String(fetchSpy.mock.calls[0][0])).toMatch(/\/console\/api\/yo$/);
    fetchSpy.mockRestore();
  });
});
