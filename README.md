# floorm

floorm is tiny declarative state manager for react apps with intuitive orm schemas providing automatic updates of parent instances

inspirited by such libraries as redux, normalizr and effector

## core concepts

1. **pithiness** every line of code should have maximum payload with readability in project context saving

2. **non-recurring** same things should be implemented with same familiar approaches

3. **regeneration** key which applied to data instance once can be changed and never deleted from it

## docs

* [orm](https://github.com/lioeaet/floorm/tree/master/docs/orm.md)
* [door](https://github.com/lioeaet/floorm/tree/master/docs/door.md)
* [stone](https://github.com/lioeaet/floorm/tree/master/docs/stone.md)
* [useDoor](https://github.com/lioeaet/floorm/tree/master/docs/useDoor.md)
* [useStone](https://github.com/lioeaet/floorm/tree/master/docs/useStone.md)

## usage

1. create orm of your project instances

```js
// hotel/orm.js
import { orm } from 'floorm'

// book instance have author instance in key "author"
const bookOrm = orm(() => ({
  author: authorOrm
}), 'book')

// author instance have array of book instances in key "books"
const authorOrm = orm(() => ({
  books: [bookOrm]
}), 'author')
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
    // with floorm change
    changeName: name => bookDoor.put(id, { name })
  }
}

const loadBook = id => bookDoor.put(id, api.book.get(id))

const changeBookName = (id, name) => bookDoor.put(id, { name })
```
```js
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

const loadAuthor = id => authorDoor.put(api.authors.get(id))
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
        // every change of book will change author instance after and target Author component will rerendered
        onChange={e => changeName(e.target.value)}
        value={book.name}
      />
      <div>
        <div>author:</div>
        {author.name}
      </div>
    </div>
  )
}
```
```js
// ui/Author.jsx
import { useBook } from 'hotel/book'

const Author = ({ id }) => {
  const { author, changeName } = useAuthor(id)

  return (
    <div>
      <input
        // on change author it will changed 
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

see [demo](https://github.com/lioeaet/floorm/tree/master/demo) for more info

* docs
* article
* jest
* optimize
* the stones
