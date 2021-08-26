const FAVORITE_BOOKS = [
{
  id: 'book Birth of Tragedy',
  name: 'The Birth of Tragedy from the Spirit of Music',
  favorite: true,
  description: 'its so good',
  author: {
    id: 'author Nietzsche',
    name: 'Friedrich Nietzsche'
  }
},
]

const AUTHORS = {
  'author Nietzsche': {
    id: 'author Nietzsche',
    name: 'Friedrich Nietzsche',
    img: 'http://localhost:7337/img/nietzsche.jpg',
    booksPreview: [
      { 
        id: 'book Birth of Tragedy',
        name: 'The Birth of Tragedy from the Spirit of Music',
        description: 'its so good',
      },
    ],
    country: 'Prussia'
  },
}

const BOOKS = {
  'book Birth of Tragedy': {
    id: 'book Birth of Tragedy',
    name: 'The Birth of Tragedy from the Spirit of Music',
    favorite: true,
    description: 'its so good',
    img: 'http://localhost:7337/img/birth.png',
    author: {
      id: 'author Nietzsche',
      name: 'Friedrich Nietzsche'
    }
  },
}

module.exports = {
  FAVORITE_BOOKS,
  AUTHORS,
  BOOKS
}
