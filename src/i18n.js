import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslation from 'translations/en.js'
import jpTranslation from 'translations/jp.js'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    jp: { translation: jpTranslation },
  },
  lng: 'jp',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
