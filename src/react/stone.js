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
      if (typeof diff === 'function') {
        const item = orm.get(STONE_ID) || {}
        diff = diff(item.state)
      }
      return isPromise(diff)
        ? putPromise(orm, normId, diff, true)
        : orm.put(genStoneInst(diff))
    },
    get: () => {
      const inst = orm.get(STONE_ID)
      return inst && inst.state
    },
    isLoading: () => hasPromise(normId),
    orm,
    name,
    normId
  }

  const enhancedStone = enhancers.reduce(
    (prevStone, enhancer) => enhancer(prevStone),
    stone
  )
  return enhancedStone
}

const enhancers = []
stone.enhance = enhancer => enhancers.push(enhancer)
