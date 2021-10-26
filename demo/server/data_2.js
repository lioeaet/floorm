const favoriteBooks = [
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
{
  id: 2,
  name: 'Human, All Too Human',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  }
}
]

const author = {
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
      { id: 2,
        name: 'Human, All Too Human',
        description: 'its so good',
      }
    ],
    country: 'Prussia'
  }
}

const book = {
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
  2: {
    id: 2,
    name: 'Human, All Too Human',
    favorite: true,
    description: 'its so good',
    img: 'http://localhost:7337/img/evolution.png',
    author: {
      id: 1,
      name: 'Friedrich Nietzsche'
    }
  }
}

module.exports = {
  favoriteBooks,
  author,
  book
}
