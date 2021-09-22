import { orm } from '*'

// pass func for await const bookOrm = ... execution
export const userOrm = orm(() => ({
  favoriteBooks: [bookOrm]
}), 'user')

export const bookOrm = orm(() => ({
  author: authorOrm
}), 'book')

export const authorOrm = orm(() => ({
  booksPreview: [bookOrm],
  pattiMix: orm.oneOf(item =>
    item.hasOwnProperty('author') ?
      bookOrm : authorOrm
  )
}), 'author')
