# base

## description

Orm description is object with relations mapping.

It's deep plain object without any keys excluding way to child orm.

Description consists from:

1. Plain objects
2. Arrays with orm instance
3. Orms

```js
import { orm } from 'floorm'

// create orm for author instance
const authorOrm = orm('author')

// create orm for book instance
const bookOrm = orm('book', () => ({
  author: authorOrm, // declares that book instance can have author in key "author"
}))

// now we can put some book with author to bookOrm
// and author will be inserted to authorOrm automatically
bookOrm.put({
  id: 1,
  name: 'In Our Time',
  author: {
    id: 1,
    name: 'Ernest Hemingway'
  },
})

console.log(bookOrm.get(1)) // { id: 1, name: 'In Our Time', author: ... }

console.log(authorOrm.get(1)) // { id: 1, name: 'Ernest Hemingway' }

console.log(authorOrm.get(1) === bookOrm.get(1).author) // true
```

Deep description example:

```js
import { orm } from 'floorm'

const xOrm = orm('x')

const yOrm = orm('y', () => ({
  shallow: xOrm, // xOrm instance stores in y.shallow
  deep: {
    deeper: xOrm // xOrm instance stores in y.deep.deeper
  },
  array: [yOrm] // array of yOrm instances stores in y.array
}))
```

## diff

`diff` is structure for make changes of your orm instances.
