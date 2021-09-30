import { stone, useStone } from '*'
import api from '../api'
import { authorOrm } from '../hotel/orm'

export default () => {
  if (authorsSt.isLoading()) return
  loadAuthors()
}

const authorsSt = stone(
  [authorOrm],
  'authors'
)

export const useAuthors = () => {
  return {
    authors: useStone(authorsSt)
  }
}

const loadAuthors = () =>
  authorsSt.put(
    api.authors.get()
  )
  .catch(() => {})
