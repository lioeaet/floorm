import { normalizeId, isPromise, enhance } from '*/utils'
import { putPromise, hasPromise } from '*/cellar/promises'

export const door = orm => {
  const door = {
    name: orm.name,
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
    }
  }
  return enhance(enhancers, door)
}

const enhancers = []
door.enhance = enhancer => enhancers.push(enhancer)
