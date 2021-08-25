import g from '*/global'
import {
  normalizeId,
  extractId,
  relationsIncrement,
  relationsDecrement,
  relationsUpdateArrayRemovedChilds,
  applyLoops,
  isOrm,
  resolveDiff,
  isPlainObject,
  notify,
  // cloneMap
} from '*/utils'

const stack = []
let loops = new Map
let updatedNormIds = new Map

const putItem = (orm, normId, diff) => {
  g.currentUpdatedAt = Date.now()
  diff = resolveDiff(diff, g.items.get(normId))
  loops = new Map
  updatedNormIds = new Map

  const result = mergeItem(orm, normId, diff, null)
  updateParents(updatedNormIds)
  applyLoops(updatedNormIds, loops)
  notify(updatedNormIds)
  return result
}

const mergeItem = (orm, normId, diff, parentNormId) => {
  const item = g.items.get(normId)
  g.ormsById.set(normId, orm)

  if (updatedNormIds.get(normId)) {
    const itemLoops = loops.get(normId)
    const loop = [...stack, normId]

    if (!itemLoops) loops.set(normId, [loop])
    else itemLoops.push(loop)

    relationsIncrement(normId, parentNormId)

    return g.items.get(normId)
  }

  if (diff === item) return item

  updatedNormIds.set(normId, true)
  g.updatedAt.set(normId, g.currentUpdatedAt)

  if (!diff) {
    if (item) {
      g.items.set(normId, diff)
      relationsDecrement(normId, parentNormId)
    }
    return diff
  }
  stack.push(normId)

  relationsIncrement(normId, parentNormId)

  const nextItem = generateInst(diff)
  g.items.set(normId, nextItem)

  merge(g.descriptions.get(orm.normId), item, diff, normId, nextItem)

  stack.pop()
  return nextItem
}

const merge = (desc, inst, diff, parentNormId, nextInst) => {
  diff = resolveDiff(diff, inst)
  if (!diff) return diff

  if (isOrm(desc)) {
    const id = extractId(diff, inst)
    const normId = normalizeId(desc, id)

    return mergeItem(desc, normId, diff, parentNormId)
  }

  if (isPlainObject(diff)) {
    for (let key in diff) {
      const keyDesc = desc && desc[key]
      const keyValue = inst && inst[key]

      stack.push(key)
      nextInst[key] = merge(keyDesc, keyValue, diff[key], parentNormId, generateInst(diff[key]))
      stack.pop()
    }
    if (isPlainObject(inst) && isPlainObject(nextInst))
      for (let key in inst)
        if (!diff.hasOwnProperty(key)) {
          const keyDesc = desc && desc[key]
          const keyValue = inst && inst[key]

          stack.push(key)
          nextInst[key] = merge(keyDesc, keyValue, keyValue, parentNormId, generateInst(diff[key]))
          stack.pop()
        }

    return nextInst
  }

  if (Array.isArray(diff)) {
    // установить id для массивов в extractId
    // случай массива массивов
    if (Array.isArray(desc)) {
      const childOrm = desc[0]
      const nextChilds = new Map
      diff.forEach((childDiff, i) => {
        const id = extractId(childDiff)
        const childNormId = normalizeId(childOrm, id)
        nextChilds.set(childNormId, true)

        stack.push(i)
        nextInst[i] = mergeItem(childOrm, childNormId, childDiff, parentNormId)
        stack.pop()
      })
      relationsUpdateArrayRemovedChilds(inst, nextInst, nextChilds, parentNormId)

      return nextInst
    }
    else diff.forEach((item, i) => (nextInst[i] = item))
  }

  return nextInst
}

const generateInst = diff => Array.isArray(diff) ? [] : isPlainObject(diff) ? {} : diff

export const updateParents = normIds => {
  for (let normId of normIds.keys()) {
    const parents = g.parents.get(normId)
    if (!parents) continue

    for (let parentNormId of parents.keys()) {
      if (normIds.has(parentNormId)) continue

      const orm = g.ormsById.get(normId)
      const desc = g.descriptions.get(orm.normId)
      const nextParent = Array.isArray(desc) ? [] : {}

      g.items.set(parentNormId, nextParent)
      updateParentLevel(desc, g.items.get(parentNormId), nextParent)
    }
  }
}

const updateParentLevel = (desc, level, nextLevel) => {
  if (isOrm(desc)) {
    const id = extractId(level)
    const normId = normalizeId(desc, id)
    const item = g.items.get(normId)

    return item
  }
  if (isPlainObject(desc)) {
    if (!isPlainObject(level)) return level
    for (let key in level)
      nextLevel[key] = updateParentLevel(desc[key], level[key])

    return nextLevel
  }
  if (Array.isArray(desc)) {
    if (!Array.isArray(level)) return level
    nextLevel = nextLevel || []
    for (let i = 0; i < level.length; i++)
      nextLevel[i] = updateParentLevel(desc[0], level[i])

    return nextLevel
  }
  return level
}

export default putItem
