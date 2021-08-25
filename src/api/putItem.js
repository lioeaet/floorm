import g from '*/global'
import {
  normalizeId,
  extractId,
  relationsIncrement,
  relationsDecrement,
  relationsUpdateArrayRemovedChilds,
  deferRefreshes,
  applyLoops,
  isOrm,
  resolveDiff,
  isPlainObject,
  notify,
  // cloneMap
} from '*/utils'
import getItem from '*/api/getItem'

const stack = []
let loops = new Map()
let updatedIds = new Map()

const putItem = (orm, normId, diff) => {
  g.currentUpdatedAt = Date.now()
  diff = resolveDiff(diff, getItem(normId))
  loops = new Map()
  updatedIds = new Map()

  const result = mergeItem(orm, normId, diff, null)
  applyLoops(updatedIds, loops)
  deferRefreshes(updatedIds)
  notify(updatedIds)
  return result
}

const mergeItem = (orm, normId, diff, parentId) => {
  const item = getItem(normId)
  g.ormsById.set(normId, orm)

  if (updatedIds.get(normId)) {
    const itemLoops = loops.get(normId)
    const loop = [...stack, normId]

    if (!itemLoops) loops.set(normId, [loop])
    else itemLoops.push(loop)

    relationsIncrement(normId, parentId)

    return g.items.get(normId)
  }

  if (diff === item) return item

  updatedIds.set(normId, true)
  g.updatedAt.set(normId, g.currentUpdatedAt)

  if (!diff) {
    if (item) {
      g.items.set(normId, diff)
      relationsDecrement(normId, parentId)
    }
    return diff
  }
  stack.push(normId)

  g.refreshes.delete(normId)
  relationsIncrement(normId, parentId)

  const nextItem = Array.isArray(diff) ? [] : isPlainObject(diff) ? {} : diff
  g.items.set(normId, nextItem)

  merge(g.descriptions.get(orm), item, diff, normId, nextItem)

  stack.pop()
  return nextItem
}

const merge = (desc, level, diff, parentId, inst) => {
  diff = resolveDiff(diff, level)
  if (!diff) return diff

  if (isOrm(desc)) {
    const id = extractId(diff, level)
    const normId = normalizeId(desc, id)

    return mergeItem(desc, normId, diff, parentId)
  }

  if (isPlainObject(diff) && isPlainObject(inst)) {
    for (let key in diff) {
      const keyDesc = desc && desc[key]
      const keyValue = level && level[key]

      stack.push(key)
      inst[key] = merge(keyDesc, keyValue, diff[key], parentId, inst)
      stack.pop()
    }
    if (isPlainObject(level) && isPlainObject(inst))
      for (let key in level)
        if (!diff.hasOwnProperty(key)) {
          const keyDesc = desc && desc[key]
          const keyValue = level && level[key]

          stack.push(key)
          inst[key] = merge(keyDesc, keyValue, keyValue, parentId)
          stack.pop()
        }

    return inst
  }

  if (Array.isArray(diff) && Array.isArray(desc)) {
    // oneOf !array
    const result = Array.isArray(inst) ? inst : []
    const childOrm = desc[0]
    const nextChilds = new Map()
    diff.forEach((childDiff, i) => {
      const id = extractId(childDiff)
      const childNormId = normalizeId(childOrm, id)
      nextChilds.set(childNormId, true)

      stack.push(i)
      result[i] = mergeItem(childOrm, childNormId, childDiff, parentId)
      stack.pop()
    })
    relationsUpdateArrayRemovedChilds(level, result, nextChilds, parentId)

    return result
  }

  return diff
}

export default putItem
