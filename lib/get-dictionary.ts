const dictionaries = {
  it: () => import('../dictionaries/it.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  de: () => import('../dictionaries/de.json').then((module) => module.default),
  fr: () => import('../dictionaries/fr.json').then((module) => module.default),
}

export type SupportedLocale = keyof typeof dictionaries

export const isSupportedLocale = (locale: string): locale is SupportedLocale => locale in dictionaries

export const resolveLocale = (locale: string): SupportedLocale => (
  isSupportedLocale(locale) ? locale : 'it'
)

export const getDictionary = async (locale: string) => dictionaries[resolveLocale(locale)]()