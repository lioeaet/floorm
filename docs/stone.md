# stone

`stone` is like a door to orm instance which exists at one exemplar

```js
import { stone, useStone } from 'floorm'
import { authorOrm } from 'orm'

const favoriteAuthorsStone = stone(
  'favoriteAuthors',
  [authorOrm]
)
```
