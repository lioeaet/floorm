import { stone, useStone } from '*'
import api from '../api'
import { bookOrm } from '../hotel/orm'
import { bookDoor } from '../hotel/book'

export default () => loadFavoriteBooks()

const favoriteBooksStone = stone(
  'favoriteBooks',
  [bookOrm]
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
  const nextBook = bookDoor.put(
    bookId,
    { favorite: !bookDoor.get(bookId).favorite }
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
  favoriteBooksStone.put((fbs = []) =>
    [book, ...fbs]
  )

const removeFromFavorite = book =>
  favoriteBooksStone.put((fbs = []) =>
    fbs.filter(fb => book !== fb)
  )
