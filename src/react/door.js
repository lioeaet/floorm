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
    name: orm.name
  }
  return door
}
