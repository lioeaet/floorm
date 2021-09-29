import g from '*/global'
import { normalizeId, isPromise, enhance } from '*/utils'
import { orm as ormFactory } from '*/factories/orm'
import { putPromise, hasPromise } from '*/cellar/promises'

export const STONE_ID = 'stone'
export const genStoneInst = item => ({
  state: item,
  id: STONE_ID
})

export const stone = (desc, name) => {
  desc = genStoneInst(desc)
  const orm = ormFactory(() => desc, name)
  const normId = normalizeId(orm, STONE_ID)

  g.orms[name] = orm
  return enhance(enhancers, {
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
    name
  })
}
const enhancers = []
stone.enhance = enhancer => enhancers.push(enhancer)
