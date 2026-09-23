import { subscribe } from 'valtio/vanilla'
import i18next from './i18n.js'

const renderFeedback = (error, status) => {
  const input = document.querySelector('#feed-url')
  const button = document.querySelector('#submit-button')
  const feedback = document.querySelector('#feedback')
  const hasError = Boolean(error)
  const isLoading = status === 'loading'
  const message = error
    ? i18next.t(error)
    : status === 'loading'
      ? i18next.t('messages.loading')
      : status === 'success'
        ? i18next.t('messages.success')
        : ''

  input.classList.toggle('border-red-500', hasError)
  input.classList.toggle('border-slate-300', !hasError)
  input.classList.toggle('focus:border-red-500', hasError)
  input.classList.toggle('focus:border-blue-500', !hasError)
  input.classList.toggle('focus:ring-red-500', hasError)
  input.classList.toggle('focus:ring-blue-500', !hasError)
  input.disabled = isLoading
  button.disabled = isLoading

  feedback.textContent = message
  feedback.classList.toggle('hidden', !message)
  feedback.classList.toggle('text-red-400', hasError)
  feedback.classList.toggle('text-amber-300', isLoading)
  feedback.classList.toggle('text-green-400', status === 'success')
}

const renderFeeds = (feeds) => {
  const container = document.querySelector('#feeds')
  container.replaceChildren()

  feeds.forEach((feed) => {
    const item = document.createElement('article')
    item.className = 'border-b border-slate-200 p-5 last:border-b-0'

    const title = document.createElement('h3')
    title.className = 'text-xl font-semibold text-slate-900'
    title.textContent = feed.title

    const description = document.createElement('p')
    description.className = 'mt-2 text-slate-500'
    description.textContent = feed.description

    item.append(title, description)
    container.append(item)
  })
}

const renderPosts = (posts) => {
  const container = document.querySelector('#posts')
  container.replaceChildren()

  posts.forEach((post) => {
    const item = document.createElement('li')
    item.className = 'flex items-center justify-between gap-4 border-b border-slate-200 p-5 last:border-b-0'

    const link = document.createElement('a')
    link.dataset.seen = String(post.seen)
    link.className = post.seen
      ? 'text-lg font-normal text-slate-500'
      : 'text-lg font-bold text-blue-600 hover:text-blue-800'
    link.href = post.link
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.textContent = post.title

    const previewButton = document.createElement('button')
    previewButton.className = 'shrink-0 rounded-md border border-blue-500 px-4 py-2 text-blue-600 hover:bg-blue-50'
    previewButton.dataset.postId = post.id
    previewButton.type = 'button'
    previewButton.textContent = i18next.t('modal.preview')

    item.append(link, previewButton)
    container.append(item)
  })
}

export const render = () => {
  document.title = i18next.t('title')
  document.querySelector('#app').innerHTML = `
    <div class="flex min-h-screen flex-col">
      <header class="bg-slate-800 text-white">
        <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 class="text-5xl font-normal tracking-tight sm:text-6xl">${i18next.t('title')}</h1>
          <p class="mt-3 text-xl text-slate-200 sm:text-2xl">${i18next.t('description')}</p>

          <form class="mt-7" action="#" method="post" novalidate>
            <label class="text-xl" for="feed-url">${i18next.t('form.label')}</label>
            <div class="mt-2 flex flex-col gap-4 sm:flex-row">
              <input
                class="h-14 min-w-0 flex-1 rounded-md border-slate-300 px-4 text-lg text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                id="feed-url"
                name="url"
                type="text"
                placeholder="${i18next.t('form.placeholder')}"
              />
              <button
                class="h-14 rounded-md bg-blue-600 px-10 text-xl font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                id="submit-button"
                type="submit"
              >
                ${i18next.t('form.submit')}
              </button>
            </div>
            <p class="mt-3 text-lg text-slate-300">${i18next.t('form.example')}</p>
            <p class="mt-1 hidden text-lg" id="feedback" role="alert"></p>
          </form>
        </div>
      </header>

      <main class="mx-auto grid w-full max-w-5xl flex-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <section class="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <h2 class="border-b border-slate-200 p-5 text-2xl font-semibold text-slate-900">${i18next.t('sections.posts')}</h2>
          <ul id="posts"></ul>
        </section>

        <section class="h-fit overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200">
          <h2 class="border-b border-slate-200 p-5 text-2xl font-semibold text-slate-900">${i18next.t('sections.feeds')}</h2>
          <div id="feeds"></div>
        </section>
      </main>

      <dialog class="fixed left-6 top-5 m-0 w-[calc(100%-3rem)] max-w-xl rounded-lg p-0 shadow-xl backdrop:bg-slate-950/70" id="post-modal">
        <div class="bg-white text-slate-900">
          <div class="flex items-center justify-between border-b-2 border-slate-700 p-5">
            <h3 class="text-2xl font-bold" id="modal-title"></h3>
            <button
              class="text-3xl leading-none text-slate-500 hover:text-slate-800"
              aria-label="X"
              data-close-modal
              type="button"
            >
              ×
            </button>
          </div>
          <div class="p-5 text-lg text-slate-700" data-test="modal-body">
            <p id="modal-description"></p>
          </div>
          <div class="flex justify-end gap-3 border-t-2 border-slate-700 p-5">
            <a
              class="rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              id="modal-link"
              target="_blank"
              rel="noreferrer"
              href="#"
            >
              ${i18next.t('modal.read')}
            </a>
            <button class="rounded-md bg-slate-500 px-5 py-3 font-medium text-white hover:bg-slate-600" data-close-modal type="button">
              ${i18next.t('modal.close')}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  `
}

export const watchState = (state) => {
  const renderState = () => {
    renderFeedback(state.error, state.status)
    renderFeeds(state.feeds)
    renderPosts(state.posts)
  }

  renderState()

  return subscribe(state, renderState)
}
