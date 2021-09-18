import { stone, useStone } from '*'
import api from '../api'
import { bookOrm } from '../stores/orm'
import { bookStore } from '../stores/book'

export default () => loadFavoriteBooks()

const favoriteBooksStone = stone(
  [bookOrm],
  'favoriteBooksStone'
)

export const useFavoriteBooks = () => {
  return {
    favoriteBooks: useStone(favoriteBooksStone)
  }
}

const loadFavoriteBooks = () =>
  favoriteBooksStone.put(
    api.favoriteBooks.get()
  )
  .catch(() => {})

export const toggleFavoriteBook = bookId => {
  const nextBook = bookStore.put(
    bookId,
    { favorite: !bookOrm.get(bookId).favorite }
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
  favoriteBooksStone.put(
    [book, ...(favoriteBooksStone.get() || [])]
  )

const removeFromFavorite = book =>
  favoriteBooksStone.put(
    (favoriteBooksStone.get() || []).filter(fb =>
      book !== fb
    )
  )
