import { genStoneInst } from '*/factories/stone'
import { watchItem } from '*/utils'

export const promises = {}
const promiseWatchers = {}

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
  const pWatchers = promiseWatchers[normId] || []
  for (let watcher of pWatchers) watcher(promises[normId])
}

export const watchItemWithPromise = (normId, watcher) => {
  const pWatchers = promiseWatchers[normId] || (promiseWatchers[normId] = [])
  pWatchers.push(watcher)

  const unwatchItem = watchItem(normId, watcher)

  const unwatchItemWithPromise = () => {
    unwatchItem()
    pWatchers.splice(pWatchers.indexOf(watcher), 1)
  }
  return unwatchItemWithPromise
}
