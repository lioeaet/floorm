import g from '*/global'
import { extractId, normalizeId } from '*/utils'
// import { listenOrm, listenItem } from '*/utils/notifier'
import { getItem } from '*/api/getItem'
import { putItem } from '*/api/putItem'
import { removeItem } from '*/api/removeItem'

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
      removeItem(normId)
    },
    put: diff => {
      const id = extractId(diff)
      const normId = normalizeId(name, id)
      const item = putItem(orm, normId, diff)
      return item
    },
    replace: (id, nextId, nextItem) => {},
    listen: listener => listenOrm(normId, listener),
    listenItem: (id, listener) => {
      const normId = normalizeId(orm, id)
      return listenItem(normId, listener)
    }
  }

  return orm
}

export default ormFactory
