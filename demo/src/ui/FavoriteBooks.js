import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { bookOrm } from '../hotel/orm'
import { useFavoriteBooks } from '../hotel/favoriteBooks'
import { randomColor } from '../utils'

const FavoriteBooks = () => {
  const { favoriteBooks } = useFavoriteBooks()
  const [colors, setColors] = useState(favoriteBooks.map(
    () => randomColor()
  ))
  const rColor = i => setColors(
    colors.map((c, j) => j === i ? randomColor() : c)
  )
  return (
    <>
      <h1>favorite books:</h1>
      {favoriteBooks.map((book, i) => (
        <Link
          style={{
            textDecoration: 'none',
            color: colors[i]
          }}
          to={`/book/${book.id}`}
          key={book.id}
          onMouseOver={() => rColor(i)}
          onMouseMove={() => rColor(i)}  
          onMouseOut={() => rColor(i)}
        >
          <h2>{book.name}</h2>
          {book.description}
        </Link>
      ))}
    </>
  )
}

export default FavoriteBooks
