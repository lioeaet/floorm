import g from '*/global'
import { listenOrm } from '*/utils/notifier'
import { put } from '*/api/put'

const ormArrayFactory = (desc, name) => {
  if (!name) throw 'orm name is required'
  if (g.descFuncs[name]) throw `duplicate orm name ${name}`

  g.descFuncs[name] = desc
  const normId = `floormNormId-${name}`

  const ormArray = {
    name,
    get: () => g.items[normId],
    put: diff => put(ormArray, normId, diff),
    listen: listener => listenOrm(normId, listener)
  }

  return ormArray
}

export default ormArrayFactory
