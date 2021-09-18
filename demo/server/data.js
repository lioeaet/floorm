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
{
  id: 2,
  name: 'Human, All Too Human',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  }
}, 
{
  id: 3,
  name: 'The Gay Science',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  },
},
{
  id: 4,
  name: 'Thus Spoke Zarathustra',
  favorite: true,
  description: 'its so good',
  author: {
    id: 1,
    name: 'Friedrich Nietzsche'
  }
},
{
  id: 5,
  name: 'Demons',
  favorite: true,
  description: 'its so good',
  author: {
    id: 2,
    name: 'Fyodor Dostoevsky'
  }
},
{
  id: 6,
  name: 'Crime and Punishment',
  favorite: true,
  description: 'its so good',
  author: {
    id: 2,
    name: 'Fyodor Dostoevsky'
  }
},
{
  id: 7,
  name: 'Humiliated and Insulted',
  favorite: true,
  description: 'its so good',
  author: {
    id: 2,
    name: 'Fyodor Dostoevsky'
  }
}
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
      { id: 2,
        name: 'Human, All Too Human',
        description: 'its so good',
      },
      { id: 3,
        name: 'The Gay Science',
        description: 'its so good',
      },
      /* { id: 4,
        name: 'Thus Spoke Zarathustra',
        description: 'its so good',
      }, */
    ],
    country: 'Prussia'
  },
  2: {
    id: 2,
    name: 'Fyodor Dostoevsky',
    img: 'http://localhost:7337/img/dostoevsky.jpg',
    booksPreview: [
      {
        id: 5,
        name: 'Demons',
        description: 'its so good',
      },
      {
        id: 6,
        name: 'Crime and Punishment',
        description: 'its so good',
      },
      {
        id: 7,
        name: 'Humiliated and Insulted',
        description: 'its so good',
      },
    ],
    country: 'Russia'
  },
  3: {
    id: 3,
    name: 'Sartre',
    img: 'http://localhost:7337/img/sartre.jpg',
    booksPreview: [
      {
        id: 8,
        name: 'Nausea',
        description: 'some of these days'
      }
    ],
    country: 'France'
  }
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
  },
  3: {
    id: 3,
    name: 'The Gay Science',
    favorite: true,
    description: 'its so good',
    img: 'http://localhost:7337/img/gay-science.jpg',
    author: {
      id: 1,
      name: 'Friedrich Nietzsche'
    }
  },
  4: {
    id: 4,
    name: 'Thus Spoke Zarathustra',
    favorite: true,
    description: 'its so good',
    img: 'http://localhost:7337/img/vibes.png',
    author: {
      id: 1,
      name: 'Friedrich Nietzsche'
    }
  },
  5: {
    id: 5,
    name: 'Demons',
    favorite: true,
    description: 'its so good',
    img: 'http://localhost:7337/img/demons.jpg',
    author: {
      id: 2,
      name: 'Fyodor Dostoevsky'
    }
  },
  6: {
    id: 6,
    name: 'Crime and Punishment',
    favorite: true,
    description: 'its so good',
    img: 'http://localhost:7337/img/crime.svg',
    author: {
      id: 2,
      name: 'Fyodor Dostoevsky'
    }
  },
  7: {
    id: 7,
    name: 'Humiliated and Insulted',
    favorite: true,
    description: 'its so good',
    img: 'http://localhost:7337/img/humiliated.jpg',
    author: {
      id: 2,
      name: 'Fyodor Dostoevsky'
    }
  },
  8: {
    id: 8,
    name: 'Nausea',
    favorite: false,
    description: 'some of these days',
    img: 'http://localhost:7337/img/nausea.png',
    author: {
      id: 3,
      name: 'Sartre'
    }
  },
}

module.exports = {
  FAVORITE_BOOKS,
  AUTHORS,
  BOOKS
}
