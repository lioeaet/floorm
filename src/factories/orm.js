import g from '*/global'
import { extractId, normalizeId, enhance } from '*/utils'
import { watchOrm, watchItem } from '*/utils/notifier'
import { put } from '*/api/put'
import { remove } from '*/api/remove'
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
    map: cb => map(ormInst, cb),
    watch: watcher => watchOrm(ormInst, watcher),
    watchItem: (id, watcher) => {
      const normId = normalizeId(ormInst, id)
      return watchItem(normId, watcher)
    },
    name
  }
  const enhancedOrmInst = enhance(enhancers, ormInst)
  g.orms[name] = enhancedOrmInst
  return enhancedOrmInst
}
const enhancers = []
orm.enhance = enhancer => enhancers.push(enhancer)
