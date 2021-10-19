import g from '*/global'
import { normalizeId, isPromise, enhance } from '*/utils'
import { orm as ormFactory } from '*/factories/orm'
import { get } from '*/api/get'
import { put } from '*/api/put'
import { putPromise, hasPromise } from '*/cellar/promises'

export const STONE_ID = 'stone'

export const genStoneInst = item => ({
  state: item,
  id: STONE_ID
})

export const stone = (name, desc = {}) => {
  desc = genStoneInst(desc)
  const orm = ormFactory(name, () => desc)
  const normId = normalizeId(orm, STONE_ID)

  g.orms[name] = orm

  return enhance(enhancers, {
    put: diff => {
      if (typeof diff === 'function') {
        const item = get(orm, normId) || {}
        diff = diff(item.state)
      }

      return isPromise(diff)
        ? putPromise(orm, normId, diff, true)
        : put(orm, normId, genStoneInst(diff))
    },

    get: () => {
      const inst = get(orm, normId)
      return inst && inst.state
    },

    isLoading: () => hasPromise(normId),

    name
  })
}
const enhancers = []
stone.enhance = enhancer => enhancers.push(enhancer)
