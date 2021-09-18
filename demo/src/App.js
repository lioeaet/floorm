import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from 'react-router'

import SplashScreen from './ui/SplashScreen'
import Page from './ui/Page'
import FavoriteBooks from './ui/FavoriteBooks'
import Authors from './ui/Authors'
import Author from './ui/Author'
import Book from './ui/Book'

import preloadAuthors from './stores/authors'
import preloadFavoriteBooks from './stores/favoriteBooks'
import preloadAuthor from './stores/author'
import preloadBook from './stores/book'

const routes = [
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

const App = () => 
  <Suspense fallback={<SplashScreen />}>
    {useRoutes(routes)}
  </Suspense>

export default () => {
  return (
    <BrowserRouter timeoutMs={8000}>
      <App />
    </BrowserRouter>
  )
}
