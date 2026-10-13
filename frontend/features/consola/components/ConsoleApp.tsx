'use client';

import { useContext, useMemo } from 'react';
import { ConsoleApiContext } from '../api/ConsoleApiContext';
import { createConsoleApi } from '../api/client';
import { copy } from '../copy';
import { useConsoleSession } from '../hooks/useConsoleSession';
import { ConsoleBootFallback } from './ConsoleBootFallback';
import { ConsoleScreen } from './ConsoleScreen';
import { LoginForm } from './LoginForm';

export function ConsoleApp() {
  const injected = useContext(ConsoleApiContext);
  const rawApi = useMemo(() => injected ?? createConsoleApi(), [injected]);
  const { state, api, login, logout, retry } = useConsoleSession(rawApi);

  switch (state.status) {
    case 'checking':
      return <ConsoleBootFallback />;
    case 'anonymous':
      return <LoginForm notice={null} onLogin={login} />;
    case 'expired':
      return <LoginForm notice="expired" onLogin={login} />;
    case 'signedOut':
      return <LoginForm notice="signedOut" onLogin={login} />;
    case 'disabled':
      return (
        <div className="grid min-h-dvh place-items-center px-4">
          <p role="status">{copy.disabled}</p>
        </div>
      );
    case 'unavailable':
      return (
        <div className="grid min-h-dvh place-items-center px-4">
          <div className="flex flex-col items-start gap-4">
            <p role="alert">{copy.unavailable}</p>
            <button type="button" onClick={retry} className="action action-outline cursor-pointer">
              {copy.retry}
            </button>
          </div>
        </div>
      );
    case 'authenticated':
      return (
        <ConsoleApiContext.Provider value={api}>
          <ConsoleScreen session={state.session} onSignOut={logout} />
        </ConsoleApiContext.Provider>
      );
  }
}
