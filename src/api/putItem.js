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
  cloneMap
} from '*/utils'

const stack = []
let loops = new Map
let updatedNormIds = new Map

export const putItem = (orm, normId, diff) => {
  g.currentUpdatedAt = Date.now()
  diff = resolveDiff(diff, g.items[normId])
  loops = new Map
  updatedNormIds = new Map

  const nextItem = mergeItem(orm, normId, diff, null)
  updateParents(updatedNormIds)
  applyLoops(updatedNormIds, loops)
  notify(updatedNormIds)

  return nextItem
}

const mergeItem = (orm, normId, diff, parentNormId) => {
  const item = g.items[normId]

  if (parentNormId) {
    if (!g.graph[normId]) g.graph[normId] = {}
    if (!g.graph[normId][parentNormId]) current = g.graph[normId][parentNormId] = {}
    else current = g.graph[normId][parentNormId]

    for (let i = 1; i < stack.length; i++) {
      const key = stack[i]
      if (i === stack.length - 1) current[key] = 'end'
      else current = current[key] = {}
    }
  }

  g.ormsByNormId.set(normId, orm)

  if (updatedNormIds.get(normId)) {
    const itemLoops = loops.get(normId)
    const loop = [...stack, normId]

    if (!itemLoops) loops.set(normId, [loop])
    else itemLoops.push(loop)

    relationsIncrement(normId, parentNormId)

    return g.items[normId]
  }

  if (diff === item) return item

  const desc = g.descriptions.get(orm.normId)

  updatedNormIds.set(normId, true)
  g.updatedAt.set(normId, g.currentUpdatedAt)

  if (!diff) {
    if (item) {
      g.items[normId] = diff
      relationsDecrement(normId, parentNormId)
    }
    return diff
  }
  stack.push(normId)

  relationsIncrement(normId, parentNormId)

  const nextItem = generateInst(diff)
  g.items[normId] = nextItem

  merge(desc, item, diff, normId, nextItem)

  stack.pop()
  return nextItem
}

const merge = (desc, inst, diff, parentNormId, nextInst) => {
  diff = resolveDiff(diff, inst)
  if (!diff) return diff

  if (isOrm(desc)) {
    const id = extractId(diff, inst, nextInst)
    const normId = normalizeId(desc.name, id)

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
          nextInst[key] = merge(keyDesc, keyValue, keyValue, parentNormId, generateInst(inst[key]))
          stack.pop()
        }

    return nextInst
  }

  if (Array.isArray(diff)) {
    // установить id для массивов в extractId
    // случай массива массивов говорит, что это невозможно при изменении вложенных orm
    if (Array.isArray(desc)) {
      const childOrm = desc[0]
      const nextChilds = new Map
      diff.forEach((childDiff, i) => {
        const id = extractId(childDiff)
        const childNormId = normalizeId(childOrm.name, id)
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
  const grandParentsNormIds = new Map

  for (let normId of normIds.keys()) {
    const parents = g.graph[normId]
    if (!parents) continue

    for (let parentNormId in parents) {
      if (normIds.has(parentNormId)) continue

      const graph = parentNormId[parentNormId]
      // !!! массивы много весят и пох

      const parent = g.items[parentNormId]
      const parentOrm = g.ormsByNormId.get(parentNormId)
      const parentDesc = g.descriptions.get(parentOrm.normId)
      const nextParent = Array.isArray(parentDesc) ? [] : {}

      g.items[parentNormId] = nextParent
      updateParentLevel(parentDesc, parent, nextParent)
    }
  }
}

// a: { b: { c: { prop1, prop2 } } }
// UPDATE GRANDPA
const updateParentLevel = (desc, level, nextLevel) => {
  if (isOrm(desc)) {
    const id = extractId(level)
    const normId = normalizeId(desc, id)
    const item = g.items[normId]

    return item
  }
  if (isPlainObject(desc)) {
    if (!isPlainObject(level)) return level
    for (let key in level)
      nextLevel[key] = updateParentLevel(desc[key], level[key], generateInst(level[key]))

    return nextLevel
  }
  if (Array.isArray(desc)) {
    if (!Array.isArray(level)) return level
    nextLevel = nextLevel || []
    for (let i = 0; i < level.length; i++)
      nextLevel[i] = updateParentLevel(desc[0], level[i], generateInst(level[i]))

    return nextLevel
  }
  return level
}
