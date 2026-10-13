'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { ApiResult, LoginCredentials, SessionInfo } from '../types';
import { copy } from '../copy';

interface LoginFormProps {
  notice: 'expired' | 'signedOut' | null;
  onLogin: (credentials: LoginCredentials) => Promise<ApiResult<SessionInfo>>;
}

type Failure = 'invalid' | 'failed' | null;

const CODE_LENGTH = 6;

function formatCountdown(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function LoginForm({ notice, onLogin }: LoginFormProps) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);
  const [focusCode, setFocusCode] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (focusCode > 0) codeRef.current?.focus();
  }, [focusCode]);

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const left = Math.ceil((deadline - Date.now()) / 1000);
      if (left <= 0) {
        setDeadline(null);
        setRemaining(0);
      } else {
        setRemaining(left);
      }
    };
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const locked = deadline !== null;
  const disabled = busy || locked;

  async function submit(nextCode: string) {
    setBusy(true);
    setFailure(null);
    const result = await onLogin({ user, password, code: nextCode });
    if (!mounted.current || result.ok) return;
    setBusy(false);
    const { error } = result;
    if (error.kind === 'unauthorized') {
      setFailure('invalid');
      setCode('');
      setFocusCode((n) => n + 1);
    } else if (error.kind === 'rate_limited') {
      const seconds = error.retryAfterSeconds ?? 60;
      setDeadline(Date.now() + seconds * 1000);
      setRemaining(seconds);
    } else if (error.kind !== 'aborted') {
      setFailure('failed');
    }
  }

  function onCodeChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    const completed = digits.length === CODE_LENGTH && code.length < CODE_LENGTH;
    setCode(digits);
    if (completed && user && password && !disabled) void submit(digits);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!disabled) void submit(code);
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-[22rem]">
        <h1 className="font-display text-4xl">{copy.title}</h1>

        {notice === 'expired' && (
          <p role="alert" className="mt-6 text-tinta-media">
            {copy.notice.expired}
          </p>
        )}
        {notice === 'signedOut' && (
          <p role="status" className="mt-6 text-tinta-media">
            {copy.notice.signedOut}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
          <label className="flex flex-col gap-1">
            <span className="eyebrow">{copy.login.user}</span>
            <input
              className="console-field"
              type="text"
              autoComplete="username"
              autoFocus
              required
              value={user}
              disabled={disabled}
              onChange={(event) => setUser(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="eyebrow">{copy.login.password}</span>
            <input
              className="console-field"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              disabled={disabled}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="eyebrow">{copy.login.code}</span>
            <input
              ref={codeRef}
              className="console-field tabular"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={CODE_LENGTH}
              required
              value={code}
              disabled={disabled}
              onChange={(event) => onCodeChange(event.target.value)}
            />
          </label>

          {failure && (
            <p role="alert" className="text-tinta">
              {failure === 'invalid' ? copy.login.invalid : copy.login.failed}
            </p>
          )}
          {locked && (
            <>
              <p role="alert" className="sr-only">
                {copy.login.lockedAnnouncement}
              </p>
              <p className="text-tinta">{copy.login.locked(formatCountdown(remaining))}</p>
            </>
          )}

          <button type="submit" disabled={disabled} className="action action-primary self-start disabled:opacity-60">
            {busy ? copy.login.submitting : copy.login.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
