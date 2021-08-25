const FAVORITE_BOOKS = [
{
  id: 1,
  name: 'The Birth of Tragedy from the Spirit of Music',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  }
},
]

const AUTHORS = {
  1: {
    id: 1,
    name: 'Friedrich Nietzsche',
    img: 'http://localhost:7337/img/nietzsche.jpg',
    booksPreview: [
      { 
        id: 1,
        name: 'The Birth of Tragedy from the Spirit of Music',
        description: 'its so good',
      },
    ],
    country: 'Prussia'
  },
}

const BOOKS = {
  1: {
    id: 1,
    name: 'The Birth of Tragedy from the Spirit of Music',
    favorite: true,
    description: 'its so good',
    img: 'http://localhost:7337/img/birth.png',
    author: {
      id: 1,
      name: 'Friedrich Nietzsche'
    }
  },
}

module.exports = {
  FAVORITE_BOOKS,
  AUTHORS,
  BOOKS
}
