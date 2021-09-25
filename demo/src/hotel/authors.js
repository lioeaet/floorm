import { stone, useStone } from '*'
import api from '../api'
import { authorOrm } from '../hotel/orm'

export default () => {
  if (authorsStone.isLoading()) return
  loadAuthors()
}

const authorsStone = stone(
  [authorOrm],
  'authors'
)

export const useAuthors = () => {
  return {
    authors: useStone(authorsStone)
  }
}

const loadAuthors = () =>
  authorsStone.put(
    api.authors.get()
  )
  .catch(() => {})
