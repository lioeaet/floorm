import ormFactory from '*/factories/orm'
import g from '*/global'
import putItem from '*/api/putItem'
import putItemAsync from '*/api/putItemAsync'
import getItem from '*/api/getItem'
import { normalizeId, isPromise } from '*/utils'

const stoneFactory = (desc, initState) => {
  const orm = ormFactory(desc)
  const normId = normalizeId(orm, void 0)

  const stone = {
    put: diff => {
      return isPromise(diff)
        ? putItemAsync(orm, normId, diff)
        : putItem(orm, normId, diff)
    },
    get: () => {
      return g.suspensePromises.get(normId) || getItem(normId)
    },
    isLoading: () => {
      return g.suspensePromises.has(normId) || g.refetchingPromises.has(normId)
    },
    wasLoaded: () => {
      return g.fetchedAt.has(normId)
    },
    normId
  }

  g.ormsById.set(normId, orm)
  stone.put(initState)

  return stone
}

export default stoneFactory
