import g from '*/global'
import { extractId, normalizeId } from '*/utils'
import { listenOrm, listenItem } from '*/utils/notifier'
import { put } from '*/api/put'
import { remove } from '*/api/remove'

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
      diff = typeof diff === 'function' ? diff(orm.get(id)) : diff

      const normId = normalizeId(orm, id)
      return put(orm, normId, diff)
    },
    remove: id => {
      const normId = normalizeId(orm, id)
      return remove(normId)
    },
    listen: listener => {
      return listenOrm(orm, listener)
    },
    listenItem: (id, listener) => {
      const normId = normalizeId(orm, id)
      return listenItem(normId, listener)
    }
  }

  const enhancedOrm = enhancers.reduce(
    (prevOrm, enhancer) => enhancer(prevOrm),
    orm
  )

  return enhancedOrm
}

const enhancers = []
ormFactory.enhance = enhancer => enhancers.push(enhancer)

export default ormFactory
