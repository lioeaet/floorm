import g from '*/global'
import { pathSet, pathDelete } from '*/utils'

const listeners = new Map

export const listen = (normId, listener) => {
  pathSet(listeners, normId, listener)(true)
  const unlisten = () => pathDelete(listeners, normId, listener)
  return unlisten
}

export const notify = normIds => {
  for (let normId of listeners.keys()) {
    if (!normIds.has(normId) && !g.refreshes.has(normId)) continue
    notifyOne(normId)
  }
}

export const notifyOne = normId => {
  const itemListeners = listeners.get(normId)
  if (!itemListeners) return
  for (let listener of itemListeners.keys()) listener()
}
