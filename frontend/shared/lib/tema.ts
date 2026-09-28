/**
 * Tema claro / oscuro. El tema resuelto vive en el atributo `data-tema` de <html>, que
 * pone el script inicial de app/layout.tsx antes del primer pintado. Este módulo lo lee,
 * lo cambia y avisa de los cambios, para que el botón del header se sincronice sin
 * guardar una copia del estado en React.
 *
 * Por defecto se sigue al sistema operativo. Al pulsar el botón, la elección se guarda
 * en localStorage y deja de seguir al sistema.
 */
export type Tema = 'claro' | 'oscuro';

export const CLAVE_TEMA = 'aiworks-tema';

const CONSULTA_OSCURO = '(prefers-color-scheme: dark)';

export function temaActual(): Tema {
  return document.documentElement.getAttribute('data-tema') === 'oscuro' ? 'oscuro' : 'claro';
}

function temaGuardado(): Tema | null {
  try {
    const t = localStorage.getItem(CLAVE_TEMA);
    return t === 'claro' || t === 'oscuro' ? t : null;
  } catch {
    return null;
  }
}

export function fijarTema(tema: Tema) {
  document.documentElement.setAttribute('data-tema', tema);
  try {
    localStorage.setItem(CLAVE_TEMA, tema);
  } catch {
    // Sin almacenamiento, la elección dura hasta recargar.
  }
}

/**
 * Se suscribe a los cambios de tema: los del botón (atributo de <html>) y, mientras el
 * usuario no haya elegido, los del sistema operativo.
 */
export function suscribirTema(avisar: () => void) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });

  const sistema = window.matchMedia(CONSULTA_OSCURO);
  const alCambiarSistema = () => {
    if (temaGuardado()) return;
    document.documentElement.setAttribute('data-tema', sistema.matches ? 'oscuro' : 'claro');
  };
  sistema.addEventListener('change', alCambiarSistema);

  return () => {
    observador.disconnect();
    sistema.removeEventListener('change', alCambiarSistema);
  };
}
