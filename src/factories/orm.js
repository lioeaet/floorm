import g from '*/global'
import { normalizeId } from '*/utils'
// import { listenOrm, listenItem } from '*/utils/notifier'

const listenItem = ''; const listenOrm = '';

const ormFactory = (desc, name) => {
  if (!desc) desc = {}

  const normId = normalizeId('orm', desc)
  g.descriptions.set(normId, desc)

  const orm = {
    normId,
    name,
    get: id => {
      const itemNormId = normalizeId(orm, id)
      return g.items[itemNormId]
    },
    remove: id => {},
    put: (id, item) => {},
    replace: (id, nextId, nextItem) => {},
    listen: listener => listenOrm(normId, listener),
    listenItem: (id, listener) => {
      const itemNormId = normalizeId(orm, id)
      return listenItem(itemNormId, listener)
    }
  }

  return orm
}

// abstracy notifyItems for work for all platforms

export default ormFactory
