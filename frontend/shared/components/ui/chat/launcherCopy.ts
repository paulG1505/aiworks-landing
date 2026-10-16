import type { Locale } from '@/shared/lib/i18n/translations';

export interface LauncherCopy {
  openChat: string;
  cloudTitle: string;
  cloudSubtitle: string;
  closeCloud: string;
}

export const LAUNCHER_COPY: Record<Locale, LauncherCopy> = {
  es: {
    openChat: 'Abrir el chat con el asistente de AIworks',
    cloudTitle: '¿Dudas? Pregúntenos',
    cloudSubtitle: 'Asistente de IA · responde al instante',
    closeCloud: 'Cerrar el aviso',
  },
  en: {
    openChat: 'Open the chat with the AIworks assistant',
    cloudTitle: 'Questions? Ask us',
    cloudSubtitle: 'AI assistant · answers instantly',
    closeCloud: 'Dismiss the notice',
  },
};
