import './style.css'
import state from './state.js'
import { initI18n } from './i18n.js'
import { loadFeed } from './api.js'
import { validateFeedUrl } from './validation.js'
import { render, watchState } from './view.js'

const updateInterval = 5000

const getPostId = (feedId, post) => `${feedId}:${post.link}`

const addNewPosts = (feedId, posts) => {
  const newPosts = posts
    .map((post) => ({
      ...post,
      id: getPostId(feedId, post),
      feedId,
    }))
    .filter((post) => !state.posts.some((currentPost) => currentPost.id === post.id))

  state.posts.unshift(...newPosts)
}

const addFeed = (url) => loadFeed(url).then((data) => {
  const feed = {
    id: url,
    url,
    title: data.title,
    description: data.description,
  }

  state.feeds.push(feed)
  addNewPosts(feed.id, data.posts)

  return feed
})

const checkFeed = (feed) => {
  loadFeed(feed.url)
    .then((data) => addNewPosts(feed.id, data.posts))
    .catch(() => {})
    .then(() => {
      setTimeout(() => checkFeed(feed), updateInterval)
    })
}

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
      .then((feed) => {
        checkFeed(feed)
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
