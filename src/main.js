import './style.css'
import state from './state.js'
import { initI18n } from './i18n.js'
import { validateFeedUrl } from './validation.js'
import { render, watchState } from './view.js'

initI18n().then(() => {
  render()
  watchState(state)

  const form = document.querySelector('form')
  const input = document.querySelector('#feed-url')

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    state.error = null

    validateFeedUrl(input.value, state.feeds)
      .then((url) => {
        state.feeds.push(url)
        form.reset()
        input.focus()
      })
      .catch((error) => {
        state.error = error.message
      })
  })
})
