# orm

orm is function for create relations of instances in your project

it receives description and schema and returns the object with methods for access and manipulating declared description data

all instances of orm should include "id" on their first level

**args**
1. `descriptionFunc` (*function*): function that returns relations description of its kind of instance. description of orm is always plain object.
2. `name` (*string*): name of instance kind

orm methods

`get(id: string) => T`

returns orm instance with passed id

`put(diff: object) => T`

put is only way to add or change your data in floorm except removing

it receives diff with id and changed fields of orm instance

if diff have nested orm instances according to orm description, these instances will updated too

changes will apllied to instance itself and all its known parents

it's so hard to talk about this method but de-facto it's very intuitive in practice

example

```js
const authorOrm = orm(() => {
  author: [bookOrm]
})

const bookOrm = orm(() => {
  author: authorOrm
})

authorOrm.put({
  id: 1,
  name: 'Huxley Oldous',
  books: [{
    id: 1,
    name: 'The Doors of Perception',
    favorite: false
  }]
})

console.log(authorOrm.get(1)) // { id: 1, name: 'Huxley Oldous', ... }

console.log(authorOrm.get(1).books[0]) // { id: 1, name: 'The Doors of Perception', favorite: false }

console.log(bookOrm.get(1)) // { id: 1, name: 'The Doors of Perception', favorite: false }

console.log(authorOrm.get(1).books[0] === bookOrm.get(1)) // true, Huxley includes bookOrm instance itself

// this put will changed book in bookOrm and author in authorOrm which includes changed book
bookOrm.put({
  id: 1,
  favorite: true
})

console.log(bookOrm.get(1)) // { id: 1, name: 'The Doors of Perception', favorite: true }

console.log(authorOrm.get(1).books[0]) // { id: 1, name: 'The Doors of Perception', favorite: true }

console.log(authorOrm.get(1).books[0] === bookOrm.get(1)) // true
```

`remove(id)`

remove 

`map()`

`watch()`

`watchItem()`
