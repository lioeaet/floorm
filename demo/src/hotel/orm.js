import { orm } from '*'
import logger from '../logger'

logger()

export const bookOrm = orm('book', () => ({
  author: authorOrm
}))

export const authorOrm = orm('author', () => ({
  booksPreview: [bookOrm]
}))
