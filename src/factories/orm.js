import g from '*/global'
import { extractId, normalizeId } from '*/utils'
// import { listenOrm, listenItem } from '*/utils/notifier'
import { getItem } from '*/api/getItem'
import { putItem } from '*/api/putItem'
import { removeItem } from '*/api/removeItem'
import { replaceId } from '*/api/replaceId'

const listenItem = ''; const listenOrm = '';

const ormFactory = (desc, name) => {
  if (!desc) desc = () => ({})
  g.descFuncs[name] = desc

  const orm = {
    name,
    get: id => {
      const normId = normalizeId(name, id)
      return g.items[normId]
    },
    remove: id => {
      const normId = normalizeId(name, id)
      return removeItem(normId)
    },
    replace: (id, nextId) => {
      const normId = normalizeId(name, id)
      const nextNormId = normalizeId(name, nextId)
      return replaceId(normId, nextNormId, nextId)
    },
    put: diff => {
      const id = extractId(diff)
      const normId = normalizeId(name, id)
      return putItem(orm, normId, diff)
    },
    listen: listener => listenOrm(normId, listener),
    listenItem: (id, listener) => {
      const normId = normalizeId(orm, id)
      return listenItem(normId, listener)
    }
  }

  return orm
}

export default ormFactory
