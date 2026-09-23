import i18next from 'i18next'
import ru from './locales/ru.json' with { type: 'json' }

export const initI18n = () => i18next.init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    ru,
  },
})

export default i18next
