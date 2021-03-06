import { door, useDoor } from '*'
import api from '../api'
import { authorOrm } from '../hotel/orm'
import { removeBook } from './book'

export default params => {
  const authorId = Number(params.authorId)
  if (authorDoor.loading(authorId)) return
  loadAuthor(authorId)
}

const authorDoor = door(
  authorOrm
)

export const useAuthor = authorId => {
  authorId = Number(authorId)

  return {
    author: useDoor(authorDoor, authorId),
    removeBook
  }
}

const loadAuthor = authorId => {
  authorId = Number(authorId)
  authorDoor.put(
    authorId,
    api.author.get(authorId)
  )
  .catch(() => {})
}
