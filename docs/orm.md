# orm

orm is function for create relations of instances in your project

it receives description and schema and returns the object with methods for access and manipulating declared description data

all instances of orm should include "id" on their first level

**args**
1. `descriptionFunc` (*function*): function that returns relations description of its kind of instance. description of orm is always plain object.
2. `name` (*string*): name of instance kind

orm methods

## get(id: string) => object

returns orm instance with passed id

## put(diff: object) => object

put is only way to add or change your data in floorm except removing

it receives diff with id and changed properties of orm instance

if diff have nested orm instances according to orm description, these instances will updated too

changes will apllied to instance itself and all its known parents

it's so hard to talk about this method but it's very intuitive in practice

```js
const authorOrm = orm(() => {
  author: [bookOrm]
}, 'authorOrm')

const bookOrm = orm(() => {
  author: authorOrm
}, 'authorOrm')

authorOrm.put({
  id: 1,
  name: 'Huxley Oldous',
  books: [{
    id: 1,
    name: 'The Doors of Perception',
    favorite: false
  }]
})

console.log(authorOrm.get(1)) // { id: 1, name: 'Huxley Oldous', books: [...] }

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

## remove(id)

removing is the diamond of floorm

when you should to add removing functionallity for your instance you should find all its parents by your hands to clear them too

but in floorm, since you have relations mapping, you can realize it with one function call

instance will replaced with null in all parent objects and filtered in arrays

```js
const authorOrm = orm(() => {
  books: [bookOrm],
  favoriteBook: bookOrm
}, 'authorOrm')

const bookOrm = orm(
  () => ({}),
  'bookOrm'
)

authorOrm.put({
  id: 1,
  books: [
    { id: 1, name: 'The Doors of Perception' }
  ],
  favoriteBook: { id: 1, name: 'The Doors of Perception' }
})

console.log(bookOrm.get(1)) // { id: 1, name: 'The Doors of Perception' }
console.log(authorOrm.get(1)) // { id: 1, books: [{ id: 1... }], favoriteBook: { id: 1... } }

bookOrm.remove(1)

console.log(bookOrm.get(1)) // undefined
console.log(authorOrm.get(1)) // { id: 1, books: [], favoriteBook: null }
```

`map()`

`watch()`

`watchItem()`
