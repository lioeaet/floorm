import { stone, door, orm } from '*'
// import { isPromise } from '*/utils'

let ormName, itemId, parents
const stones = {}

orm.wrap(orm => {
  const { name, put, remove } = orm

  orm.put = diff => {
    ormName = name
    itemId = diff.id
    parents = {}

    const isStone = stones.hasOwnProperty(diff)
    const prev = isStone ? orm.get(itemId).state : orm.get(itemId)
    const item = isStone ? put(diff).state : put(diff)
    diff = isStone ? diff.state : diff

    console.log(
      `${name} put`,
      { prev, diff, item, parents }
    )
    return item
  }

  orm.remove = id => {
    ormName = name
    itemId = id
    parents = {}

    remove(id)

    console.log(`${name} remove ${id}`, parents)

    return id
  }

  orm.watch((item, prev, normId) => {
    const id = item ? item.id : prev.id
    if (name === ormName && id === itemId) return
    const isStone = stones.hasOwnProperty(name)

    if (isStone) {
      item = item.state
      prev = prev.state
    }
    if (!parents[name]) parents[name] = {}

    if (isStone) {
      parents[name] = { prev, item } 
    }
    else parents[name][id] = { prev, item }
  })
  return orm
})

stone.wrap(stone => {
  const { name, put } = stone

  stones[name] = stone

  stone.put = (diff) => {
    // if (isPromise(diff)) console.log(`${name} put promise`)
    return put(diff)
  }
  return stone
})

door.wrap(door => {
  const { /* name, */ put } = door

  door.put = (id, diff) => {
    // if (isPromise(diff)) console.log(`${name} put promise ${id}`)
    return put(id, diff)
  }
  return door
})
