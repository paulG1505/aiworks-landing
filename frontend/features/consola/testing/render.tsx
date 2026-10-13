import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ConsoleApiContext } from '../api/ConsoleApiContext';
import type { ConsoleApi } from '../api/client';

export function renderWithApi(ui: ReactElement, api: ConsoleApi) {
  return render(<ConsoleApiContext.Provider value={api}>{ui}</ConsoleApiContext.Provider>);
}
