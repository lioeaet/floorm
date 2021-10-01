# floorm

* docs
* article
* jest
* optimize
* the stones

introduce react app architecture suggestion with defining orms of frontend instances for updates in parent instances automatization

docs: orm | stone | door | useStone | useDoor | demo

1. create orm of project instances

```js
/* hotel/orm.js */
import { orm } from 'floorm'

export const author = orm(() => ({
  books: [book]
}), 'author')

const book = orm(() => ({
  author: author
}), 'book')
```

2. stones and doors of hotel

create single stones & doors to orms for render it data through hooks (supports suspense)

```js
/* hotel/book.js */
import { door, useDoor } from 'floorm'
import { book as bookOrm } from 'hotel/orm'

const book = door(bookOrm)

// put promise to book id wich will throws in useDoor
const load = id =>
  book.put(id, api.book.get(id))

// update your inistances with git-diff like sekeleton
// and receive reqourcive merge result from existed instance
// and updated parent orm instances
// book can trigger update author (from author.books)
// ...wich can trigger update for favoriteAuthors if this author is favorite
// all these orm instances wich will changed automatically on book.put
const change = (id, diffSkeleton) =>
  book.put(id, diffSkeleton)

/* hotel/favoriteAuthors.js */
import { stone, useStone } from 'floorm'
import { author as authorOrm } from 'hotel/orm'
import { api } from 'api'

// favoriteAuthors is single array for app with author instances
const favoriteAuthors = stone(
  [author],
  'favoriteAuthors' // name of stone is needed for logger
)

const load = () =>
  favoriteAuthors.put(api.favoriteAuthors.get())
```

3. hooks

create hooks for rerender of your stones and orm instances at all bounded instances changes

```js
/* hotel/book.js */
import { useEffect } from 'react'
import { door, useDoor } from 'floorm'
import { book as bookOrm } from 'hotel/orm'

export const useBook = id => {
  useEffect(() => { load(id) }, [id])
  return {
    book: useDoor(book, id),
    change: diff => change(id, diff)
  }
}

const book = door(bookOrm)

const load = id =>
  book.put(id, api.book.get(id)) // put promise to book id wich will throws in useDoor(book, id)

const change = (id, diffSkeleton) =>
  book.put(id, diffSkeleton)

/* hotel/favoriteAuthors.js */
import { useEffect } from 'react'
import { stone, useStone } from 'floorm'
import { author as authorOrm } from 'hotel/orm'
import { api } from 'api'

export const useAuthors = () => {
  useEffect(() => { load() }, [])
  return {
    favoriteAuthors: useStone(favoriteAuthors) // authors is stone and have no id
  }
}

const favoriteAuthors = stone(
  [author], // favoriteAuthors is single array for app with author instances
  'favoriteAuthors'
)

const load = () =>
  favoriteAuthors.put(api.favoriteAuthors.get())
```

5. middleware

enhance your instaces with (`orm` | `door` | `stone`).`enhance`

use default logger for logging

```js
// all actions with changes graph will logged now
import 'floorm/logger'
```

see more in docs
