import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fail, ok } from '../testing/fakeApi';
import { SESSION } from '../testing/fixtures';
import { LoginForm } from './LoginForm';

afterEach(() => vi.useRealTimers());

const field = (name: string) => screen.getByLabelText(name);

describe('LoginForm', () => {
  it('Código con caracteres no numéricos', async () => {
    const onLogin = vi.fn(async () => ok(SESSION));
    render(<LoginForm notice={null} onLogin={onLogin} />);
    const user = userEvent.setup();
    await user.type(field('Usuario'), 'demo');
    await user.type(field('Clave'), 'consola-demo');
    await user.type(field('Código'), '12a3 4');

    expect(field('Código')).toHaveValue('1234');
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('Login correcto desde la interfaz: sends once when the sixth digit is typed', async () => {
    const onLogin = vi.fn(async () => ok(SESSION));
    render(<LoginForm notice={null} onLogin={onLogin} />);
    const user = userEvent.setup();
    await user.type(field('Usuario'), 'demo');
    await user.type(field('Clave'), 'consola-demo');
    await user.type(field('Código'), '123456');

    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(onLogin).toHaveBeenCalledWith({ user: 'demo', password: 'consola-demo', code: '123456' });
  });

  it('does not auto-submit while user or password are empty, but the button still sends', async () => {
    const onLogin = vi.fn(async () => ok(SESSION));
    render(<LoginForm notice={null} onLogin={onLogin} />);
    const user = userEvent.setup();
    await user.type(field('Código'), '123456');
    expect(onLogin).not.toHaveBeenCalled();

    await user.type(field('Usuario'), 'demo');
    await user.type(field('Clave'), 'consola-demo');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('Login fallido en la interfaz', async () => {
    const onLogin = vi.fn(async () => fail<typeof SESSION>('unauthorized', { status: 401 }));
    render(<LoginForm notice={null} onLogin={onLogin} />);
    const user = userEvent.setup();
    await user.type(field('Usuario'), 'demo');
    await user.type(field('Clave'), 'otra');
    await user.type(field('Código'), '123456');

    expect(await screen.findByRole('alert')).toHaveTextContent('Usuario, clave o código incorrectos.');
    expect(field('Código')).toHaveValue('');
    expect(field('Código')).toHaveFocus();
    expect(field('Usuario')).toHaveValue('demo');
    expect(field('Clave')).toHaveValue('otra');
  });

  it('shows a generic message for network, server and forbidden errors', async () => {
    for (const kind of ['network', 'server', 'forbidden', 'timeout'] as const) {
      const onLogin = vi.fn(async () => fail<typeof SESSION>(kind));
      const { unmount } = render(<LoginForm notice={null} onLogin={onLogin} />);
      fireEvent.change(field('Usuario'), { target: { value: 'demo' } });
      fireEvent.change(field('Clave'), { target: { value: 'x' } });
      fireEvent.change(field('Código'), { target: { value: '123456' } });
      expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos iniciar sesión. Intente de nuevo.');
      unmount();
    }
  });

  it('disables the form while sending and says "Entrando…"', async () => {
    let finish: (value: Awaited<ReturnType<typeof fail>>) => void = () => {};
    const onLogin = vi.fn(() => new Promise<never>((resolve) => { finish = resolve as never; }));
    render(<LoginForm notice={null} onLogin={onLogin} />);
    fireEvent.change(field('Usuario'), { target: { value: 'demo' } });
    fireEvent.change(field('Clave'), { target: { value: 'x' } });
    fireEvent.change(field('Código'), { target: { value: '123456' } });

    expect(screen.getByRole('button', { name: 'Entrando…' })).toBeDisabled();
    expect(field('Usuario')).toBeDisabled();
    await act(async () => finish(fail('unauthorized')));
  });

  it('Cuenta atrás en la interfaz', async () => {
    vi.useFakeTimers();
    const onLogin = vi.fn(async () => fail<typeof SESSION>('rate_limited', { status: 429, retryAfterSeconds: 90 }));
    render(<LoginForm notice={null} onLogin={onLogin} />);
    fireEvent.change(field('Usuario'), { target: { value: 'demo' } });
    fireEvent.change(field('Clave'), { target: { value: 'x' } });
    await act(async () => {
      fireEvent.change(field('Código'), { target: { value: '123456' } });
    });

    expect(screen.getByText('Demasiados intentos. Podrá intentar de nuevo en 1:30.')).toBeInTheDocument();
    for (const name of ['Usuario', 'Clave', 'Código']) expect(field(name)).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeDisabled();
    expect(screen.getAllByRole('alert')).toHaveLength(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(screen.getByText('Demasiados intentos. Podrá intentar de nuevo en 1:00.')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });
    expect(screen.queryByText(/Demasiados intentos/)).not.toBeInTheDocument();
    for (const name of ['Usuario', 'Clave', 'Código']) expect(field(name)).toBeEnabled();
  });
});
