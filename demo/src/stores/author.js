import { store, useStore } from '*'
import api from '../api'
import { authorOrm } from '../stores/orm'

export default params => {
  const authorId = Number(params.authorId)
  if (authorStore.isLoading(authorId)) return
  loadAuthor(authorId)
}

const authorStore = store(
  authorOrm
)

export const useAuthor = authorId => {
  authorId = Number(authorId)

  return {
    author: useStore(authorStore, authorId)
  }
}

const loadAuthor = authorId => {
  authorId = Number(authorId)
  authorStore.put(
    authorId,
    api.author.get(authorId)
  )
  .catch(() => {})
}
