# base

## description

floorm focused of relations of instances which declares by `descriptions` passed to orm function as second argument

it's easy to see description as instance without any keys excluding part of way to orm

```js
import { orm } from 'floorm'

// create orm for author instance
const authorOrm = orm('author')

const bookOrm = orm('book', () => ({
  // book instance can have author in key "author" among the rest props
  author: authorOrm
}))

// now we can put some book with author to bookOrm
bookOrm.put({
  id: 1,
  name: 'In Our Time',
  author: {
    id: 1,
    name: 'Ernest Hemingway'
  }
})

console.log(bookOrm.get(1)) // { id: 1, name: 'In Our Time', author: ... }

// author will inserted to authorOrm
console.log(authorOrm.get(1)) // { id: 1, name: 'Ernest Hemingway' }

console.log(authorOrm.get(1) === bookOrm.get(1).author) // true
```

description consists from:

1. plain objects
2. arrays with orm instance
3. orms

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


