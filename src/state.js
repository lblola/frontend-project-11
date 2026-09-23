import { proxy } from 'valtio/vanilla'

const state = proxy({
  feeds: [],
  error: null,
})

export default state
