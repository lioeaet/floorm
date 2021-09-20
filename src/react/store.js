import { putPromise, hasPromise } from '*/react/promises'
import { normalizeId, isPromise } from '*/utils'

export const store = orm => {
  const store = {
    put: (id, diff) => {
      console.log(diff)
      diff = typeof diff === 'function' ? diff(orm.get(id)) : diff
      console.log(diff)
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
  return store
}
