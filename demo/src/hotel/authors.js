import { stone, useStone } from '*'
import api from '../api'
import { authorOrm } from '../hotel/orm'

export default () => {
  if (authorsStone.loading()) return
  loadAuthors()
}

const authorsStone = stone(
  'authors',
  [authorOrm]
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
