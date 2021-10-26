import Page from './ui/Page'
import FavoriteBooks from './ui/FavoriteBooks'
import Authors from './ui/Authors'
import Author from './ui/Author'
import Book from './ui/Book'

import preloadAuthors from './hotel/authors'
import preloadFavoriteBooks from './hotel/favoriteBooks'
import preloadAuthor from './hotel/author'
import preloadBook from './hotel/book'

export const routes = [
  {
    path: '/',
    element: <Page>
      <Authors />
      <br />
      <FavoriteBooks />
    </Page>,
    preload: () => {
      preloadAuthors()
      preloadFavoriteBooks()
    }
  },
  {
    path: 'author/:authorId',
    element: <Page>
      <Author />
    </Page>,
    preload: preloadAuthor,
  },
  {
    path: 'book/:bookId',
    element: <Page>
      <Book />
    </Page>,
    preload: preloadBook,
  }
]