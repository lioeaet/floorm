import { store, useStore } from '*'
import api from '../api'
import { bookOrm } from '../stores/orm'
import { toggleFavoriteBook } from '../stores/favoriteBooks'

export default params => {
  const bookId = Number(params.bookId)
  if (bookOrmStore.isLoading(bookId) || bookOrmStore.wasLoaded(bookId)) return
  loadBook(params.bookId)
}

export const bookOrmStore = store(
  bookOrm
)

export const useBook = bookId => {
  bookId = Number(bookId)
  return {
    book: useStore(bookOrmStore, bookId) || { author: {} },

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
  bookOrmStore.put(
    bookId,
    api.book.get(bookId)
  )
  .catch(() => {})
}

const changeBook = (bookId, diff) => {
  bookId = Number(bookId)
  bookOrmStore.put(bookId, diff)

  const book = bookOrmStore.get(bookId)
  return api.book.put(bookId, diff)
    .catch(e => {
      bookOrmStore.put(bookId, book)
      throw e
    })
}
