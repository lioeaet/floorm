import { stone, useStone } from '*'
import api from '../api'
import { authorOrm } from '../stores/orm'

export default () => {
  if (authorsStone.isLoading()) return
  loadAuthors()
}

const authorsStone = stone(
  [authorOrm],
  'authorsStone'
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
