import { stone, useStone } from '*'
import api from '../api'
import { authorOrm } from '../stores/orm'

export default () => {
  if (authorsStone.isLoading() || authorsStone.wasLoaded()) return 
  loadAuthors()
}

const authorsStone = stone(
  [authorOrm],
  []
)

export const useAuthors = () => ({
  authors: useStone(authorsStone)
})

const loadAuthors = () =>
  authorsStone.put(
    api.authors.get()
  )
  .catch(() => {})
