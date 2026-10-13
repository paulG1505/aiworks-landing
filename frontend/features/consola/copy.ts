export const copy = {
  title: 'Consola',
  boot: 'Comprobando sesión…',
  disabled: 'La consola no está activa.',
  unavailable: 'No pudimos contactar la API.',
  retry: 'Reintentar',
  signOut: 'Salir',
  notice: {
    expired: 'Su sesión caducó. Vuelva a entrar.',
    signedOut: 'Sesión cerrada.',
  },
  login: {
    user: 'Usuario',
    password: 'Clave',
    code: 'Código',
    submit: 'Entrar',
    submitting: 'Entrando…',
    invalid: 'Usuario, clave o código incorrectos.',
    failed: 'No pudimos iniciar sesión. Intente de nuevo.',
    lockedAnnouncement: 'Demasiados intentos. Espere antes de intentar de nuevo.',
    locked: (time: string) => `Demasiados intentos. Podrá intentar de nuevo en ${time}.`,
  },
  summary: {
    heading: (month: string) => `Resumen de ${month}`,
  },
  inbox: {
    label: 'Conversaciones',
  },
  reader: {
    label: 'Conversación',
  },
} as const;
