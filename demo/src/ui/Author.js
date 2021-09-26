import React, { Fragment, useState } from 'react'
import { css } from 'astroturf'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuthor } from '../hotel/author'
import { randomColor } from '../utils'
import Flag from './Flag'

const Author = () => {
  const { authorId } = useParams()
  const { author, removeBook } = useAuthor(authorId)
  const [colors, setColors] = useState(author.booksPreview.map(
    () => randomColor()
  ))
  const rColor = i => setColors(
    colors && colors.map((c, j) => j === i ? randomColor() : c)
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
          <div key={book.id}>
            <Link
              to={`/book/${book.id}`}
              style={{
                color: colors[i],
                border: `${colors[i]} solid 1px`
              }}
              className={s.link}
              onMouseOver={() => rColor(i)}
              onMouseMove={() => rColor(i)}
              onMouseOut={() => rColor(i)}
            >
              {book.name}
            </Link>
            <div
              onClick={() => removeBook(book.id)}
              className={s.remove}
            >
              remove
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const s = css`
  .link {
    display: block;
    width: fit-content;
    text-decoration: none;
    padding: 10px;
    border-radius: 3px;
    margin-bottom: 5px;
  }
  .remove {
    cursor: pointer;
    margin-bottom: 10px;
  }
`

export default Author
