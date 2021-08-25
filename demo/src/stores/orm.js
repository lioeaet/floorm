import { orm } from '*'

export const userOrm = orm(() => ({
  favoriteBooks: [bookOrm]
}))

// pass func for await const authorOrm execution
export const bookOrm = orm(() => ({
  author: authorOrm
}))

export const authorOrm = orm({
  booksPreview: [bookOrm]
})
