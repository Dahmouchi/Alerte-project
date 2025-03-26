import 'server-only';

import { Locale } from '@/i18n.config';
import { Languages } from '@/constants/enums';

const dictionaries = {
  ar: () => import('@/messages/en.json').then((module) => module.default),
  en: () => import('@/messages/fr.json').then((module) => module.default),
};

const getTrans = async (locale: Locale) => {
  return locale === Languages.FRANSH ? dictionaries.ar() : dictionaries.en();
};

export default getTrans;