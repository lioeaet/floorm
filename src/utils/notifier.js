import g from '*/global'
import { extractId } from '*/utils'

export const listenOrm = (orm, listener) => {
  const listeners = g.ormListeners[orm.name] || (g.ormListeners[orm.name] = [])
  listeners.push(listener)
  return () => listeners.splice(listeners.indexOf(listener), 1)
}

export const listenItem = (normId, listener) => {
  const listeners = g.itemListeners[normId] || (g.itemListeners[normId] = [])
  listeners.push(listener)
  return () => listeners.splice(listeners.indexOf(listener), 1)
}

export const notify = nextItems => {
  for (let normId in nextItems)
    notifyOne(normId)
  console.log('=======')
}

export const notifyOne = normId => {
  const item = g.items[normId]
  const id = extractId(item)
  const orm = g.ormsByNormId[normId]
  const itemListeners = g.itemListeners[normId] || []
  const ormListeners = g.ormListeners[orm.name] || []

  for (let listener of itemListeners) listener(item)
  for (let listener of ormListeners) listener(id, item)
}
