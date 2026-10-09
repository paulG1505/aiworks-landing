// The resolved theme lives in the `data-tema` attribute of <html>, set by the inline
// script in app/layout.tsx before first paint. The stored values stay in Spanish
// because they are persisted in visitors' localStorage.
export type Theme = 'claro' | 'oscuro';

export const THEME_KEY = 'aiworks-tema';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-tema') === 'oscuro' ? 'oscuro' : 'claro';
}

function storedTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'claro' || stored === 'oscuro' ? stored : null;
  } catch {
    return null;
  }
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-tema', theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Without storage the choice lasts until reload.
  }
}

// Follows the OS theme only while the visitor has not made an explicit choice.
export function subscribeTheme(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });

  const systemQuery = window.matchMedia(DARK_QUERY);
  const onSystemChange = () => {
    if (storedTheme()) return;
    document.documentElement.setAttribute('data-tema', systemQuery.matches ? 'oscuro' : 'claro');
  };
  systemQuery.addEventListener('change', onSystemChange);

  return () => {
    observer.disconnect();
    systemQuery.removeEventListener('change', onSystemChange);
  };
}
