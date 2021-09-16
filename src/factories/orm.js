import g from '*/global'
import { extractId, normalizeId } from '*/utils'
import { listenOrm, listenItem } from '*/utils/notifier'
import { put } from '*/api/put'
import { remove } from '*/api/remove'
import { replace } from '*/api/replace'

const ormFactory = (desc, name) => {
  if (!name) throw 'orm name is required'
  if (g.descFuncs[name]) throw `duplicate orm name ${name}`

  g.descFuncs[name] = desc

  const orm = {
    name,
    get: id => {
      const normId = normalizeId(orm, id)
      return g.items[normId]
    },
    put: diff => {
      const id = extractId(diff)
      const normId = normalizeId(orm, id)
      return put(orm, normId, diff)
    },
    remove: id => {
      const normId = normalizeId(orm, id)
      return remove(normId)
    },
    replace: (id, nextId) => {
      const normId = normalizeId(orm, id)
      const nextNormId = normalizeId(orm, nextId)
      return replace(normId, nextNormId, nextId)
    },
    listen: listener => {
      return listenOrm(orm, listener)
    },
    listenItem: (id, listener) => {
      const normId = normalizeId(orm, id)
      return listenItem(normId, listener)
    }
  }

  return orm
}

export default ormFactory
