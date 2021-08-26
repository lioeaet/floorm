import g from '*/global'
import { notifyOne } from '*/utils'
import { actualizeLoading } from '*/loading'
import { putItem } from '*/api/putItem'

const putItemAsync = (orm, normId, promise) => {
  const gPromises = !g.preloading && !g.fetchedAt.has(normId)
    ? g.suspensePromises
    : g.refetchingPromises

  const result = promise.then(
    item => {
      if (gPromises.get(normId) !== result) throw 'canceled'
      gPromises.delete(normId)
      g.fetchedAt.set(normId, Date.now())
      actualizeLoading()
      return putItem(orm, normId, item)
    },
    error => {
      if (gPromises.get(normId) !== result) throw 'canceled'
      gPromises.delete(normId)
      actualizeLoading()
      throw error
    }
  )
  gPromises.set(normId, result)
  notifyOne(normId)
  actualizeLoading()
  return result
}

export default putItemAsync
