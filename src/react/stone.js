import g from '*/global'
import ormFactory from '*/factories/orm'
import { put } from '*/api/put'
import { normalizeId, isPromise } from '*/utils'
import { putPromise, hasPromise } from './promises'

const STONE_ID = 'stone'
export const genStoneInst = item => ({
  state: item,
  id: STONE_ID
})

export const stone = (desc, name) => {
  desc = genStoneInst(desc)
  const orm = ormFactory(() => desc, name)
  const normId = normalizeId(orm, STONE_ID)

  const stone = {
    put: diff => {
      diff = typeof diff === 'function' ? diff(g.items[normId].state) : diff
      return isPromise(diff)
        ? putPromise(orm, normId, diff, true)
        : put(orm, normId, genStoneInst(diff))
    },
    get: () => {
      return g.items[normId] && g.items[normId].state
    },
    isLoading: () => hasPromise(normId),
    orm,
    normId
  }
  return stone
}
