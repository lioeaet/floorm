const express = require('express')
const { AUTHORS, BOOKS, FAVORITE_BOOKS } = require('./data')

const router = express.Router()

const api = {
  'author/:id': {
    get: params => ({ ...AUTHORS[params.id] })
  },
  authors: {
    get: () => Object.values(AUTHORS)
  },
  'book/:id': {
    get: params => ({ ...BOOKS[params.id] }),

    put: (params, body) => putBook(params.id, body.diff)
  },
  favoriteBooks: {
    get: () => [...FAVORITE_BOOKS],
  }
}

for (let name in api) {
  for (let method in api[name]) {
    router[method](`/${name}`, (req, res) => {
      res.send(JSON.stringify(
        api[name][method](req.params, req.body)
      ))
    })
  }
}

const putBook = (bookId, diff) => {
  bookId = Number(bookId)
  const book = { ...BOOKS[bookId] }
  BOOKS[bookId] = book
  if (diff.hasOwnProperty('favorite')) {
    if (book.favorite !== diff.favorite)
      toggleFavoriteBook(bookId, book)
  }
  const favIdx = FAVORITE_BOOKS
    .findIndex(fb => fb.id === bookId)
  if (favIdx !== -1) FAVORITE_BOOKS[favIdx] = book
  putAuthorPreviewBook(bookId, book)
  for (let key in diff) book[key] = diff[key]
  return book
}

const toggleFavoriteBook = (bookId, book) => {
  bookId = Number(bookId)
  const index = FAVORITE_BOOKS
    .findIndex(fb => fb.id === bookId)
  if (index === -1) FAVORITE_BOOKS.unshift(book)
  else FAVORITE_BOOKS.splice(index, 1)
  return FAVORITE_BOOKS
}

const putAuthorPreviewBook = (bookId, book) => {
  bookId = Number(bookId)
  const authorId = book.author.id
  AUTHORS[authorId] = {
    ...AUTHORS[authorId],
    booksPreview: AUTHORS[authorId].booksPreview
      .map(b => b.id === bookId ? book : b)
  }
}

module.exports = router
