import { door, useDoor } from '*'
import api from '../api'
import { bookOrm } from '../hotel/orm'
import { toggleFavoriteBook } from '../hotel/favoriteBooks'

export default params => {
  const bookId = Number(params.bookId)
  if (bookDoor.loading(bookId)) return
  loadBook(bookId)
}

export const bookDoor = door(
  bookOrm
)

export const useBook = bookId => {
  bookId = Number(bookId)

  return {
    book: useDoor(bookDoor, bookId),

    changeBook: diff =>
      changeBook(bookId, diff)
        .catch(console.error),

    toggleFavorite: () =>
      toggleFavoriteBook(bookId)
        .catch(console.error),

    removeBook: () =>
      removeBook(bookId)
  }
}

const loadBook = bookId => {
  bookId = Number(bookId)
  bookDoor.put(
    bookId,
    api.book.get(bookId)
  )
  .catch(() => {})
}

const changeBook = (bookId, diff) => {
  bookId = Number(bookId)
  bookDoor.put(bookId, diff)

  const book = bookDoor.get(bookId)
  return api.book.put(bookId, diff)
    .catch(e => {
      bookDoor.put(bookId, book)
      throw e
    })
}

export const removeBook = bookId =>
  api.book.remove(bookId).then(() =>
    bookDoor.remove(bookId)
  ).catch(console.error)
