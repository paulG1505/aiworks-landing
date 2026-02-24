import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { translations, type Translation } from '@/shared/lib/i18n/translations';

export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const t = translations[locale] as Translation;

  return { t, locale };
}
