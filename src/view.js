import { subscribe } from 'valtio/vanilla'
import i18next from './i18n.js'

const renderError = (error) => {
  const input = document.querySelector('#feed-url')
  const feedback = document.querySelector('#feedback')
  const hasError = Boolean(error)

  input.classList.toggle('border-red-500', hasError)
  input.classList.toggle('border-slate-300', !hasError)
  input.classList.toggle('focus:border-red-500', hasError)
  input.classList.toggle('focus:border-blue-500', !hasError)
  input.classList.toggle('focus:ring-red-500', hasError)
  input.classList.toggle('focus:ring-blue-500', !hasError)

  feedback.textContent = error ? i18next.t(error) : ''
  feedback.classList.toggle('hidden', !hasError)
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
                type="submit"
              >
                ${i18next.t('form.submit')}
              </button>
            </div>
            <p class="mt-3 text-lg text-slate-300">${i18next.t('form.example')}</p>
            <p class="mt-1 hidden text-lg text-red-400" id="feedback" role="alert"></p>
          </form>
        </div>
      </header>

      <main class="flex-1"></main>
    </div>
  `
}

export const watchState = (state) => {
  renderError(state.error)

  return subscribe(state, () => {
    renderError(state.error)
  })
}
