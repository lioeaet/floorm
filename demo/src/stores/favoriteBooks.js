import { stone, useStone } from '*'
import api from '../api'
import { bookOrm } from '../stores/orm'
import { bookOrmStore } from '../stores/book'

export default () => {
  if (favoriteBooksStone.isLoading() || favoriteBooksStone.wasLoaded()) return
  loadFavoriteBooks()
}

const favoriteBooksStone = stone(
  [bookOrm],
  []
)

export const useFavoriteBooks = () => ({
  favoriteBooks: useStone(favoriteBooksStone)
})

const loadFavoriteBooks = () =>
  favoriteBooksStone.put(
    api.favoriteBooks.get()
  )
  .catch(() => {})

export const toggleFavoriteBook = bookId => {
  const nextBook = bookOrmStore.put(
    bookId,
    book => ({ favorite: !book.favorite })
  )
  if (nextBook.favorite) addToFavorite(nextBook)
  else removeFromFavorite(nextBook)

  return api.book.put(bookId, nextBook)
    .catch(e => {
      if (nextBook.favorite) removeFromFavorite(nextBook)
      else addToFavorite(nextBook)
      throw e
    })
}

const addToFavorite = book =>
  favoriteBooksStone.put(favoriteBooks =>
    [book, ...favoriteBooks]
  )

const removeFromFavorite = book =>
  favoriteBooksStone.put(favoriteBooks =>
    favoriteBooks.filter(fb =>
      book.id !== fb.id
    )
  )
