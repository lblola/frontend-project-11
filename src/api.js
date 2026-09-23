import axios from 'axios'
import { parseFeed } from './parser.js'

const buildProxyUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

export const loadFeed = (url) => axios.get(buildProxyUrl(url))
  .then((response) => {
    if (!response.data.contents) {
      throw new Error('errors.parse')
    }

    return parseFeed(response.data.contents)
  })
  .catch((error) => {
    if (error.message === 'errors.parse') {
      return Promise.reject(error)
    }

    return Promise.reject(new Error('errors.network'))
  })
