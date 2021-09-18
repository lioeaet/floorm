import { store, useStore } from '*'
import api from '../api'
import { bookOrm } from '../stores/orm'
import { toggleFavoriteBook } from '../stores/favoriteBooks'

export default params => {
  const bookId = Number(params.bookId)
  if (bookStore.isLoading(bookId)) return
  loadBook(bookId)
}

export const bookStore = store(
  bookOrm
)

export const useBook = bookId => {
  bookId = Number(bookId)

  return {
    book: useStore(bookStore, bookId),

    changeBook: diff =>
      changeBook(bookId, diff)
        .catch(console.error),

    toggleFavorite: () =>
      toggleFavoriteBook(bookId)
        .catch(console.error)
  }
}

const loadBook = bookId => {
  bookId = Number(bookId)
  bookStore.put(
    bookId,
    api.book.get(bookId)
  )
  .catch(() => {})
}

const changeBook = (bookId, diff) => {
  bookId = Number(bookId)
  bookStore.put(bookId, diff)

  const book = bookStore.get(bookId)
  return api.book.put(bookId, diff)
    .catch(e => {
      bookStore.put(bookId, book)
      throw e
    })
}
