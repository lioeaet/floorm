import g from '*/global'
import { extractId, normalizeId, enhance } from '*/utils'
import { listenOrm, listenItem } from '*/utils/notifier'
import { put } from '*/api/put'
import { remove } from '*/api/remove'
import { find } from '*/api/find'
import { map } from '*/api/map'

export const orm = (desc, name) => {
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
    find: cb => find(ormInst, cb),
    map: cb => map(ormInst, cb),
    listen: listener => listenOrm(ormInst, listener),
    listenItem: (id, listener) => {
      const normId = normalizeId(ormInst, id)
      return listenItem(normId, listener)
    },
    name
  }
  const enhancedOrmInst = enhance(enhancers, ormInst)
  g.orms[name] = enhancedOrmInst
  return enhancedOrmInst
}
const enhancers = []
orm.enhance = enhancer => enhancers.push(enhancer)
