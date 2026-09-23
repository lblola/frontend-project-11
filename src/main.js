import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="flex min-h-screen flex-col">
    <header class="bg-slate-800 text-white">
      <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 class="text-5xl font-normal tracking-tight sm:text-6xl">RSS агрегатор</h1>
        <p class="mt-3 text-xl text-slate-200 sm:text-2xl">Начните читать RSS сегодня! Это легко, это красиво.</p>

        <form class="mt-7" action="#" method="post">
          <label class="text-xl" for="feed-url">Ссылка RSS</label>
          <div class="mt-2 flex flex-col gap-4 sm:flex-row">
            <input
              class="h-14 min-w-0 flex-1 rounded-md border-slate-300 px-4 text-lg text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              id="feed-url"
              name="url"
              type="text"
              placeholder="ссылка RSS"
              required
            />
            <button
              class="h-14 rounded-md bg-blue-600 px-10 text-xl font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800"
              type="submit"
            >
              Добавить
            </button>
          </div>
          <p class="mt-3 text-lg text-slate-300">Пример: https://lorem-rss.hexlet.app/feed</p>
        </form>
      </div>
    </header>

    <main class="flex-1"></main>
  </div>
`
