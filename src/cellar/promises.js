import { genStoneInst } from '*/factories/stone'
import { normalizeId, watchItem } from '*/utils'

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

export const watchItemWithPromise = (orm, id, watcher) => {
  const normId = normalizeId(orm, id)
  const pWatchers = promiseWatchers[normId] || (promiseWatchers[normId] = [])
  pWatchers.push(watcher)

  const unwatchItem = watchItem(orm, id, watcher)

  const unwatchItemWithPromise = () => {
    unwatchItem()
    pWatchers.splice(pWatchers.indexOf(watcher), 1)
  }
  return unwatchItemWithPromise
}
