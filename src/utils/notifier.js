import g from '*/global'

const itemListeners = {}
const ormListeners = {}

export const listenOrm = (orm, listener) => {
  const listeners = ormListeners[orm.name] || (ormListeners[orm.name] = [])
  listeners.push(listener)
  return () => listeners.splice(listeners.indexOf(listener), 1)
}

export const listenItem = (normId, listener) => {
  const listeners = itemListeners[normId] || (itemListeners[normId] = [])
  listeners.push(listener)
  return () => listeners.splice(listeners.indexOf(listener), 1)
}

export const notify = nextItems => {
  for (let normId in nextItems)
    notifyItem(normId)
}

export const notifyItem = normId => {
  const item = g.items[normId]
  const orm = g.ormsByNormId[normId]
  const itemListenersArr = itemListeners[normId] || []
  const ormListenersArr = ormListeners[orm.name] || []

  for (let listener of itemListenersArr) listener(item)
  for (let listener of ormListenersArr) listener(item)
}
