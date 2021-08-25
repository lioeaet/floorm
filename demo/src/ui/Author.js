import React, { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PreloadLink } from '*'
import { useAuthor } from '../stores/author'
import { randomColor } from '../utils'
import Flag from './Flag'

const Author = () => {
  const { authorId } = useParams()
  const { author } = useAuthor(Number(authorId))
  const [colors, setColors] = useState(author.booksPreview.map(
    () => randomColor()
  ))
  const rColor = i => setColors(
    colors.map((c, j) => j === i ? randomColor() : c)
  )

  return (
    <>
      <h1>
        {author.name}
      </h1>
      <img
        src={author.img}
        style={{
          width: 150
        }}
        alt="author"
      />
      <div>
        <Flag country={author.country} />
        {author.country}
      </div>
      <div>
        <br/>
        <h3>
          books:
        </h3>
        {author.booksPreview.map((book, i) => (
          <Fragment key={book.id}>
            <PreloadLink
              to={`/book/${book.id}`}
              style={{
                display: 'block',
                width: 'fit-content',
                textDecoration: 'none',
                color: colors[i],
                border: `${colors[i]} solid 1px`,
                padding: 10,
                borderRadius: 3,
              }}
              onMouseOver={() => rColor(i)}
              onMouseMove={() => rColor(i)}
              onMouseOut={() => rColor(i)}
            >
              {book.name}
            </PreloadLink>
            <br/>
          </Fragment>
        ))}
      </div>
    </>
  )
}

export default Author
