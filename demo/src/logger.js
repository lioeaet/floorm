import { stone, door, orm, watch } from '*'

export default () => {
  let updates
  const stones = {}

  orm.enhance(orm => {
    const { name } = orm

    watch(orm, (item, prev) => {
      const id = item ? item.id : prev.id
      const isStone = stones.hasOwnProperty(name)

      if (!updates[name]) updates[name] = {}

      if (isStone) {
        updates[name] = {
          prev: prev && prev.state,
          item: item && item.state
        }
      }
      else updates[name][id] = { prev, item }
    })
    return orm
  })

  stone.enhance(stone => {
    const { name, get, put } = stone

    stones[name] = stone

    const enhancedPut = diff => {
      if (isPromise(diff)) {
        diff.then(enhancedPut)
        return put(diff)
      }

      updates = {}

      const prev = get()
      const resolvedDiff = typeof diff === 'function'
        ? diff(get())
        : diff
      const item = put(diff)

      console.log(
        `${name} put`,
        { prev, diff: resolvedDiff, item, updates }
      )
      return item
    }

    stone.put = enhancedPut
    return stone
  })

  door.enhance(door => {
    const { name, get, put, remove } = door

    const enhancedPut = (id, diff) => {
      if (isPromise(diff)) {
        diff.then(result => enhancedPut(id, result))
        return put(id, diff)
      }

      updates = {}

      const prev = get(id)
      const resolvedDiff = typeof diff === 'function'
        ? diff(get(id))
        : diff
      const item = put(id, diff)

      console.log(
        `${name} put`,
        { prev, diff: resolvedDiff, item, updates }
      )
      return item
    }

    door.put = enhancedPut

    door.remove = id => {
      updates = {}
      const removedItem = get(id)

      remove(id)

      console.log(`${name} remove ${id}`, { removedItem, updates })

      return id
    }

    return door
  })

  const isPromise = inst => inst && typeof inst.then === 'function'
}
