import g from '*/global'
import {
  notify,
  normalizeId,
  extractId,
  // relationsUpdateArrayRemovedChilds,
  isOrm,
  isPlainObject,
} from '*/utils'
import getItem from '*/api/getItem'

let wasRemovedItem = false
let updatedIds = new Map()

const removeItem = normId => {
  updatedIds = new Map()
  updatedIds.set(normId, true)
  const item = getItem(normId)
  const itemParents = g.parents[normId]

  for (let parentNormId in itemParents) {
    updatedIds.set(parentNormId, true)
    const parent = getItem(parentNormId)
    const parentOrm = g.ormsByNormId[parentNormId]
    const parentDesc = g.descriptions[parentOrm.normId]()

    let nextParent
    if (isPlainObject(parentDesc)) {
      nextParent = {}
      for (let key in parent) {
        nextParent[key] = mergeRemoving(
          parentDesc[key],
          parent[key],
          normId,
          parentNormId
        )
        if (wasRemovedItem) {
          wasRemovedItem = false
        }
      }
    }
    if (Array.isArray(parentDesc))
      nextParent = parent.filter(item => {
        const id = extractId(item)
        const childNormId = normalizeId(parentDesc[0], id)
        if (childNormId === normId) {
          return false
        }
        return true
      })
    g.items[parentNormId] = nextParent
  }
  g.items[normId] = null
  delete g.ormsByNormId[normId]
  delete g.parents[normId]
  g.suspensePromises.delete(normId)
  g.refreshes.delete(normId)
  notify(updatedIds)

  return item
}

const mergeRemoving = (desc, level, normId, parentNormId) => {
  if (!desc) return level
  if (isOrm(desc)) {
    if (level === getItem(normId)) {
      wasRemovedItem = true
      return null
    }
    return level
  }
  if (isPlainObject(desc)) {
    const mergedLevel = {}
    for (let key in level)
      mergedLevel[key] = mergeRemoving(desc[key], level[key], normId)

    return wasRemovedItem ? mergedLevel : level
  }
  if (Array.isArray(desc) && Array.isArray(level)) {
    if (!isOrm(desc[0])) return level
    const nextChilds = new Map()
    const filteredItem = level.filter(child => {
      const id = extractId(child) 
      const childNormId = normalizeId(desc[0], id)

      nextChilds.set(childNormId, true)
      if (child !== getItem(normId)) return true
      wasRemovedItem = true
      return false
    })
    if (wasRemovedItem) {
      // relationsUpdateArrayRemovedChilds(
      //   level,
      //   filteredItem,
      //   nextChilds,
      //   parentNormId
      // )
      return filteredItem
    }
  }
  return level
}

export default removeItem
