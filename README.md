# floorm

**[base]()**  **[orm](https://github.com/lioeaet/floorm/tree/master/docs/orm.md)**  **[door](https://github.com/lioeaet/floorm/tree/master/docs/door.md)**  **[stone](https://github.com/lioeaet/floorm/tree/master/docs/stone.md)**  **[logger](https://github.com/lioeaet/floorm/tree/master/logger.md)**  **[playground]()**

declarative state manager for react with orm

conceived as union of approaches used by such libraries as redux, normalizr, react, effector & mobx

## install

```
npm i -S floorm
```

## mental model

- **id** instances of project have id for access and manipulation
- **pithiness** every sign of code should have maximum payload with saving readability in project context
- **relations** updates of instances should rerender all components wich uses them or their parents
- **consistency** same things should be implemented with same approaches
- **simple data structures** store data in plain objects and arrays format for comfortable interaction

## guide

1. create orm of your project instances

```js
// hotel/orm.js
import { orm } from 'floorm'

// book instance have author instance in key "author"
const bookOrm = orm('book', () => ({
  author: authorOrm
}))

// author instance have array of book instances in key "books"
const authorOrm = orm('author', () => ({
  books: [bookOrm]
}))
```

2. create doors to orm instances or single-instance stones for use their state through hooks

```js
// hotel/book.js
import { door, useDoor } from 'floorm'
import { bookOrm } from 'hotel/orm'

const bookDoor = door(bookOrm)

export const useBook = id => {
  useEffect(() => {
    loadBook(id)
  }, [id])

  return {
    book: useDoor(authorDoor, id),
    // with floorm you should not fall into spread-hell with copy all keys like in redux reducers
    // put method receives diff like this.setState of react class components with nesting support
    // so you can pass object with updated keys of instances only
    // missed keys will substituted to next instance from the box
    changeName: name => bookDoor.put(id, { name })
  }
}

const loadBook = id => bookDoor.put(id, api.book.get(id))

const changeBookName = (id, name) => bookDoor.put(id, { name })


// hotel/author.js
import { door, useDoor } from 'floorm'
import { authorOrm } from 'hotel/orm'
import { api } from 'api'

const authorDoor = useDoor(authorOrm)

export const useAuthor = id => {
  useEffect(() => {
    loadAuthor(id)
  }, [id])

  return {
    author: useDoor(authorDoor, id),
    changeName: name => authorDoor.put(id, { name })
  }
}

const loadAuthor = id => authorDoor.put(id, api.authors.get(id))
```

3. use hooks of your instances in components

```js
// ui/Book.jsx
import { useBook } from 'hotel/book'

export const Book = ({ id }) => {
  const { book, changeName } = useBook(id)

  return (
    <div>
      <input
        // every change of book will changed author instance too
        // Author component which includes changed author will rerendered for display updated books list
        onChange={e => changeName(e.target.value)}
        value={book.name}
      />
      <div>
        author: {author.name}
      </div>
    </div>
  )
}


// ui/Author.jsx
import { useBook } from 'hotel/book'

const Author = ({ id }) => {
  const { author, changeName } = useAuthor(id)

  return (
    <div>
      <input
        // every change of author will changed his books instances too
        // Book components which includes changed author will rerendered for display updated author.name
        onChange={e => changeName(e.target.value)}
        value={author.name}
      />
      {books.map(book => {
        <div key={book.id}>{book.name}</div>
      })}
    </div>
  )
}
```

see [demo](https://github.com/lioeaet/floorm/tree/master/demo) for more examples

or read [docs](https://github.com/lioeaet/floorm/tree/master/docs/orm.md) for more info

* article
* flat
* errors
* cancel actions
* jest
* optimize
* normId->nesting
