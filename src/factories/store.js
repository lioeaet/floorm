import g from '*/global'
import putItem from '*/api/putItem'
import putItemAsync from '*/api/putItemAsync'
import getItem from '*/api/getItem'
import replaceItem from '*/api/replaceItem'
import removeItem from '*/api/removeItem'
import { normalizeId, isPromise } from '*/utils'

const storeFactory = orm => {
  const normId = normalizeId(orm, void 0)

  const store = {
    put: (id, diff) => {
      const normId = normalizeId(orm, id)
      return isPromise(diff)
        ? putItemAsync(orm, normId, diff)
        : putItem(orm, normId, diff)
    },
    get: id => {
      const normId = normalizeId(orm, id)
      return g.suspensePromises.get(normId) || getItem(normId)
    },
    replace: (id, nextValue) => {
      const normId = normalizeId(orm, id)
      return replaceItem(normId, nextValue)
    },
    remove: id => {
      const normId = normalizeId(orm, id)
      return removeItem(normId)
    },    
    isLoading: id => {
      const normId = normalizeId(orm, id)
      return g.suspensePromises.has(normId) || g.refetchingPromises.has(normId)
    },
    wasLoaded: id => {
      const normId = normalizeId(id)
      return g.fetchedAt.has(normId)
    },
    normId
  }

  g.ormsById.set(normId, orm)

  return store
}

export default storeFactory
