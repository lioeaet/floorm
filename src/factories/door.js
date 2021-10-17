import { get } from '*/api/get'
import { put } from '*/api/put'
import { remove } from '*/api/remove'
import { all } from '*/api/all'
import { normalizeId, isPromise, enhance } from '*/utils'
import { putPromise, hasPromise } from '*/cellar/promises'

export const door = orm => {
  return enhance(enhancers, {
    put: (id, diff) => {
      diff = typeof diff === 'function' ? diff(orm.get(id)) : diff

      return isPromise(diff)
        ? putPromise(orm, normalizeId(orm, id), diff)
        : put(orm, normalizeId(orm, id), { id, ...diff })
    },

    get: id => get(normalizeId(orm, id)),

    remove: id => remove(orm, normalizeId(orm, id)),

    all: () => all(orm),

    isLoading: id => hasPromise(normalizeId(orm, id)),

    name: orm.name
  })
}
const enhancers = []
door.enhance = enhancer => enhancers.push(enhancer)
