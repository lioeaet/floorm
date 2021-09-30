import { normalizeId, isPromise, enhance } from '*/utils'
import { putPromise, hasPromise } from '*/cellar/promises'

export const door = orm => {
  return enhance(enhancers, {
    put: (id, diff) => {
      diff = typeof diff === 'function' ? diff(orm.get(id)) : diff
      return isPromise(diff)
        ? putPromise(orm, normalizeId(orm, id), diff)
        : orm.put({ id, ...diff })
    },
    get: id => orm.get(id),
    remove: id => orm.remove(id),
    isLoading: id => hasPromise(normalizeId(orm, id)),
    name: orm.name
  })
}
const enhancers = []
door.enhance = enhancer => enhancers.push(enhancer)
