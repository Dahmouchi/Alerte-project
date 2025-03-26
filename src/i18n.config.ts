import { Languages } from '@/constants/enums';

export type LanguageType = Languages.FRANSH | Languages.ENGLISH;

type i18nType = {
  defaultLocale: LanguageType;
  locales: LanguageType[];
};

export const i18n: i18nType = {
  defaultLocale: Languages.FRANSH,
  locales: [Languages.FRANSH, Languages.ENGLISH],
};

export type Locale = (typeof i18n)['locales'][number];