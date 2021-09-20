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
    get: id => orm.get(id),

    replace: (id, nextId) => orm.replace(id, nextId),

    remove: id => orm.remove(id),

    isLoading: id => hasPromise(normalizeId(orm, id)),

    orm
  }
  return door
}
