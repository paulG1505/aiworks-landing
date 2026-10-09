export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'aiworks-tema';

// Values already saved in visitors' browsers; changing them would reset their preference.
const STORED_VALUE: Record<Theme, string> = { light: 'claro', dark: 'oscuro' };

const DARK_QUERY = '(prefers-color-scheme: dark)';

export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');var s=null;try{s=localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){}var t=s==='${STORED_VALUE.light}'?'light':s==='${STORED_VALUE.dark}'?'dark':window.matchMedia('${DARK_QUERY}').matches?'dark':'light';d.setAttribute('data-theme',t)})()`;

export function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === STORED_VALUE.light) return 'light';
    if (value === STORED_VALUE.dark) return 'dark';
    return null;
  } catch {
    return null;
  }
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, STORED_VALUE[theme]);
  } catch {
    // Without storage the choice lasts until reload.
  }
}

export function subscribeTheme(notify: () => void) {
  const mutationObserver = new MutationObserver(notify);
  mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const system = window.matchMedia(DARK_QUERY);
  const onSystemChange = () => {
    if (storedTheme()) return;
    document.documentElement.setAttribute('data-theme', system.matches ? 'dark' : 'light');
  };
  system.addEventListener('change', onSystemChange);

  return () => {
    mutationObserver.disconnect();
    system.removeEventListener('change', onSystemChange);
  };
}
