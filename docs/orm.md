# orm

## orm(name, ?() => description)

Orm is function for create relations of instances in your project. It receives description and schema and returns the object with methods for access and manipulating declared description data. All instances of orm should include "id" on their first level.

**args**

1. `name` (*string*): name of instance kind
2. `descriptionFunc` (*function*): function that returns relations description of its kind of instance. Description of orm is always plain object.


```js
// by this description author can have :
// array of instances from bookOrm in key books 
const authorOrm = orm('authorOrm', () => {
  books: [bookOrm]
})

const bookOrm = orm('bookOrm', () => {
  author: authorOrm
})
```

next: door, useDoor
