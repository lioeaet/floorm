const express = require('express')
const { author, book, favoriteBooks } = require('./data')

const router = express.Router()

const api = {
  'author/:id': {
    get: params => ({ ...author[params.id] })
  },
  authors: {
    get: () => Object.values(author)
  },
  'book/:id': {
    get: params => ({ ...book[params.id] }),

    put: (params, body) => putBook(params.id, body.diff),

    delete: ({ id }) => {
      const target = book => Number(book.id) === Number(id)
      delete book[id]

      const a = Object.values(author).find(a => a.booksPreview.some(target))
      const aI = a.booksPreview.findIndex(target)
      a.booksPreview.splice(aI, 1)

      const fI = favoriteBooks.findIndex(target)
      if (fI !== -1) favoriteBooks.splice(fI, 1)
      return id
    }
  },
  favoriteBooks: {
    get: () => [...favoriteBooks],
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
  const b = { ...book[bookId] }
  book[bookId] = b
  if (diff.hasOwnProperty('favorite')) {
    if (b.favorite !== diff.favorite)
      toggleFavoriteBook(bookId, b)
  }
  const favIdx = favoriteBooks
    .findIndex(fb => fb.id === bookId)
  if (favIdx !== -1) favoriteBooks[favIdx] = b
  putAuthorPreviewBook(bookId, b)
  for (let key in diff) b[key] = diff[key]
  return b
}

const toggleFavoriteBook = (bookId, book) => {
  bookId = Number(bookId)
  const index = favoriteBooks
    .findIndex(fb => fb.id === bookId)
  if (index === -1) favoriteBooks.unshift(book)
  else favoriteBooks.splice(index, 1)
  return favoriteBooks
}

const putAuthorPreviewBook = (bookId, book) => {
  bookId = Number(bookId)
  const authorId = book.author.id
  author[authorId] = {
    ...author[authorId],
    booksPreview: author[authorId].booksPreview
      .map(b => b.id === bookId ? book : b)
  }
}

module.exports = router
