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
      seen: false,
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
  const posts = document.querySelector('#posts')
  const modal = document.querySelector('#post-modal')
  const modalTitle = document.querySelector('#modal-title')
  const modalDescription = document.querySelector('#modal-description')
  const modalLink = document.querySelector('#modal-link')
  const closeModalButtons = document.querySelectorAll('[data-close-modal]')

  posts.addEventListener('click', (event) => {
    const previewButton = event.target.closest('[data-post-id]')

    if (!previewButton) {
      return
    }

    const post = state.posts.find(({ id }) => id === previewButton.dataset.postId)

    if (!post) {
      return
    }

    post.seen = true
    modalTitle.textContent = post.title
    modalDescription.textContent = post.description
    modalLink.href = post.link
    modal.showModal()
  })

  closeModalButtons.forEach((button) => {
    button.addEventListener('click', () => modal.close())
  })

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
