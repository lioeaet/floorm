# base

## description

floorm focused of relations of instances which declares by `descriptions` passed to orm function as second argument

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

// author will automatically inserted to authorOrm


```


