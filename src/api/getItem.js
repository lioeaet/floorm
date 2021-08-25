import g from '*/global'
import {
  normalizeId,
  extractId,
  isOrm,
  isPlainObject
} from '*/utils'

const getItem = normId => {
  const cachedItem = g.items.get(normId)

  if (!g.refreshes.has(normId)) return cachedItem

  const orm = g.ormsById.get(normId)
  const desc = g.descriptions.get(orm)

  const nextItem = Array.isArray(desc) ? [] : isPlainObject(desc) ? {} : cachedItem
  g.items.set(normId, nextItem)
  g.refreshes.delete(normId)

  return refreshLevel(desc, cachedItem, nextItem)
}

const refreshLevel = (desc, level, nextLevel) => {
  if (isOrm(desc)) {
    const id = extractId(level)
    const normId = normalizeId(desc, id)
    const item = getItem(normId)

    return item
  }
  if (isPlainObject(desc)) {
    if (!isPlainObject(level)) return level
    for (let key in level)
      nextLevel[key] = refreshLevel(desc[key], level[key])

    return nextLevel
  }
  if (Array.isArray(desc)) {
    if (!Array.isArray(level)) return level
    nextLevel = nextLevel || []
    for (let i = 0; i < level.length; i++)
      nextLevel[i] = refreshLevel(desc[0], level[i])

    return nextLevel
  }
  return level
}

export default getItem
