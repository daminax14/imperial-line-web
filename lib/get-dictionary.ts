const dictionaries = {
  it: () => import('../dictionaries/it.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  de: () => import('../dictionaries/de.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'it' | 'en' | 'de') => dictionaries[locale]()