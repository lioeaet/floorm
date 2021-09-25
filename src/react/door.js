import { putPromise, hasPromise } from '*/react/promises'
import { normalizeId, isPromise } from '*/utils'

export const door = orm => {
  const door = {
    put: (id, diff) => {
      diff = typeof diff === 'function' ? diff(orm.get(id)) : diff
      return isPromise(diff)
        ? putPromise(orm, normalizeId(orm, id), diff)
        : orm.put({ id, ...diff })
    },
    get: id => {
      return orm.get(id)
    },
    replace: (id, nextId) => {
      return orm.replace(id, nextId)
    },
    remove: id => {
      return orm.remove(id)
    },
    isLoading: id => {
      return hasPromise(normalizeId(orm, id))
    },
    orm,
    name: orm.name
  }

  const enhancedDoor = enhancers.reduce(
    (prevDoor, enhancer) => enhancer(prevDoor),
    door
  )
  return enhancedDoor
}

const enhancers = []
door.enhance = enhancer => enhancers.push(enhancer)
