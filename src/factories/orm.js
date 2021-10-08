import g from '*/global'
import { extractId, normalizeId, enhance } from '*/utils'
import { put } from '*/api/put'
import { remove } from '*/api/remove'
import { all } from '*/api/all'

export const orm = (name, desc = () => ({})) => {
  if (!name) throw 'orm name is required'
  if (g.descFuncs[name]) throw `duplicate orm name ${name}`

  g.descFuncs[name] = desc
  const ormInst = {
    get: id => {
      const normId = normalizeId(ormInst, id)
      return g.items[normId]
    },
    put: diff => {
      const id = extractId(diff)
      diff = typeof diff === 'function' ? diff(ormInst.get(id)) : diff

      const normId = normalizeId(ormInst, id)
      return put(ormInst, normId, diff)
    },
    remove: id => {
      const normId = normalizeId(ormInst, id)
      return remove(normId)
    },
    all: cb => all(ormInst),
    name
  }
  const enhancedOrmInst = enhance(enhancers, ormInst)
  g.orms[name] = enhancedOrmInst
  return enhancedOrmInst
}
const enhancers = []
orm.enhance = enhancer => enhancers.push(enhancer)
