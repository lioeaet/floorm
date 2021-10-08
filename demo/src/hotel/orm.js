import { orm } from '*'
import './logger'

export const userOrm = orm('user', () => ({
  favoriteBooks: [bookOrm]
}))

export const bookOrm = orm('book', () => ({
  author: authorOrm
}))

export const authorOrm = orm('author', () => ({
  booksPreview: [bookOrm]
}))
