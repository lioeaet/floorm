import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthors } from '../stores/authors'
import Flag from './Flag'
import { randomColor } from '../utils'

const Authors = () => {
  const { authors } = useAuthors()
  const [colors, setColors] = useState(authors.map(
    () => randomColor()
  ))
  const rColor = i => setColors(
    colors.map((c, j) => j === i ? randomColor() : c)
  )

  return (
    <>
      <h1>authors:</h1>
      {authors.map((author, i) =>
        <Link
          to={`/author/${author.id}`}
          key={author.id}
          style={{
            textDecoration: 'none',
            color: colors[i]
          }}
          onMouseOver={() => rColor(i)}
          onMouseOut={() => rColor(i)}
        >
          <h2>
            <Flag country={author.country} />
            <span style={{ fontSize: '14px' }}>
              ({author.country})
            </span>
            {author.name}
          </h2>
        </Link>
      )}
    </>
  )
}

export default Authors
