import { stone, door, orm } from '*'
// import { isPromise } from '*/utils'

let ormName, itemId, parents
const stones = {}

orm.enhance(orm => {
  const { name, put/* , replace, remove */ } = orm

  orm.put = diff => {
    ormName = name
    itemId = diff.id
    parents = {}

    const isStone = stones.hasOwnProperty(diff)
    const prevItem = isStone ? orm.get(itemId).state : orm.get(itemId)
    const itemDiff = isStone ? diff.state : diff
    const nextItem = isStone ? put(diff).state : put(diff)

    console.log(
      `${name} put`,
      { prevItem, diff: itemDiff, nextItem, parents }
    )
    return nextItem
  }

  orm.listen((item, prevItem, normId) => {
    const id = item ? item.id : prevItem.id
    if (name === ormName && id === itemId) return
    const isStone = stones.hasOwnProperty(name)

    if (isStone) {
      item = item.state
      prevItem = prevItem.state
    }
    if (!parents[name]) parents[name] = {}

    if (isStone) {
      parents[name] = { prev: prevItem, next: item } 
    }
    else parents[name][id] = { prev: prevItem, next: item }
  })
  return orm
})

stone.enhance(stone => {
  const { name, put } = stone

  stones[name] = stone

  stone.put = (diff) => {
    // if (isPromise(diff)) console.log(`${name} put promise`)
    return put(diff)
  }
  return stone
})

door.enhance(door => {
  const { /* name, */ put } = door

  door.put = (id, diff) => {
    // if (isPromise(diff)) console.log(`${name} put promise ${id}`)
    return put(id, diff)
  }
  return door
})
