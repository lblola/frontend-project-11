import './style.css'
import state from './state.js'
import { initI18n } from './i18n.js'
import { loadFeed } from './api.js'
import { validateFeedUrl } from './validation.js'
import { render, watchState } from './view.js'

const addFeed = (url) => loadFeed(url).then((data) => {
  const feed = {
    id: url,
    url,
    title: data.title,
    description: data.description,
  }
  const posts = data.posts.map((post, index) => ({
    ...post,
    id: `${url}-${index}`,
    feedId: url,
  }))

  state.feeds.push(feed)
  state.posts.push(...posts)
})

initI18n().then(() => {
  render()
  watchState(state)

  const form = document.querySelector('form')
  const input = document.querySelector('#feed-url')

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    state.error = null
    state.status = 'idle'

    validateFeedUrl(input.value, state.feeds)
      .then((url) => {
        state.status = 'loading'
        return addFeed(url)
      })
      .then(() => {
        state.status = 'success'
        form.reset()
        input.focus()
      })
      .catch((error) => {
        state.status = 'error'
        state.error = error.message
      })
  })
})
