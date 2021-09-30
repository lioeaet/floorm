# floorm

* docs
* article
* jest
* optimize
* the doors

love my girl

introduce react app architecture suggestion with defining orms of frontend instances for updates in parent instances automatization

1. create orm of project instances

```js
import { orm } from 'floorm'

const author = orm({
  booksPreview: [book]
}, 'author')

const book = orm({
  author: author
}, 'book')
```

2. stones and doors of hotel

create stones and doors of orms for render in hooks

3. hooks

create hooks for rerender of your stones and orm instances at all

4. update

update your instances with orm.put, door.put or stone.put and receive autoupdate in parent useDoor and useStone and all listners of changed orm instances

update your inistances with git-diff like diff sekeleton and receive reqourcive merged instance

5. middleware

enhance your instaces with (orm | door | stone).enhance

```js
import 

```
