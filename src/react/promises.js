import { normalizeId, listenItem } from '*/utils'
import { genStoneInst } from './stone'

export const promises = {}
const promiseListeners = {}

export const putPromise = (orm, normId, promise, isStone) => {
  const result = promise.then(
    item => {
      if (promises[normId] !== result) throw 'canceled'
      delete promises[normId]

      item = isStone ? genStoneInst(item) : item

      return orm.put(item)
    },
    error => {
      if (promises[normId] !== result) throw 'canceled'
      delete promises[normId]
      throw error
    }
  )
  promises[normId] = result
  notifyPromise(normId)

  return result
}

export const getPromise = normId => promises[normId]

export const hasPromise = normId => promises.hasOwnProperty(normId)

const notifyPromise = normId => {
  const pListeners = promiseListeners[normId] || []
  for (let listener of pListeners) listener(promises[normId])
}

export const listenItemWithPromise = (normId, listener) => {
  const pListeners = promiseListeners[normId] || (promiseListeners[normId] = [])
  pListeners.push(listener)

  const unlistenItem = listenItem(normId, listener)

  const unlistenItemWithPromise = () => {
    unlistenItem()
    pListeners.splice(pListeners.indexOf(listener), 1)
  }
  return unlistenItemWithPromise
}
