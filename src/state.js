import { proxy } from 'valtio/vanilla'

const state = proxy({
  feeds: [],
  posts: [],
  error: null,
  status: 'idle',
})

export default state
