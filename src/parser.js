const getText = (element, selector) => element.querySelector(selector)?.textContent.trim() || ''

export const parseFeed = (content) => {
  const document = new DOMParser().parseFromString(content, 'application/xml')
  const channel = document.querySelector('channel')

  if (document.querySelector('parsererror') || !channel) {
    throw new Error('errors.parse')
  }

  const title = getText(channel, 'title')
  const description = getText(channel, 'description')
  const posts = [...channel.querySelectorAll('item')].map((item) => ({
    title: getText(item, 'title'),
    description: getText(item, 'description'),
    link: getText(item, 'link'),
  }))

  if (!title || !description) {
    throw new Error('errors.parse')
  }

  return { title, description, posts }
}
