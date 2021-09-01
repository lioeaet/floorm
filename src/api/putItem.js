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
  cloneMap,
  pathSet,
  pathGet,
  theEnd
} from '*/utils'

const stack = []
let loops = new Map
let updates = new Map // { normId: parentNormId: true }

export const putItem = (orm, normId, diff) => {
  diff = resolveDiff(diff, g.items[normId])
  loops = new Map
  updates = new Map

  mergeItem(orm, normId, diff, null)
  updateParents(updates)
  applyLoops(updates, loops)
  notify(updates)

  return g.items[normId]
}

const mergeItem = (orm, normId, diff, parentNormId) => {
  const item = g.items[normId]

  g.ormsByNormId[normId] = orm

  relationsIncrement(normId, parentNormId, stack)

  if (updates.get(normId) && !pathGet(updates, normId, parentNormId))
    return g.items[normId]

  if (diff === item) return item

  const desc = g.descriptions.get(orm.normId)

  pathSet(updates, normId, parentNormId)(true)

  if (!diff) {
    if (item) {
      g.items[normId] = diff
      relationsDecrement(normId, parentNormId, stack)
    }
    return diff
  }
  stack.push(normId)

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

const updateParents = () => {
  for (let normId of updates.keys()) {
    const parents = g.graph[normId]
    if (!parents) continue

    for (let parentNormId in parents) {
      if (updates.has(normId) && updates.get(normId).has(parentNormId))
        continue

      const parentOrm = g.ormsByNormId[parentNormId]

      if (updates.has(parentNormId)) {
        updates.get(normId).get(parentNormId)
        setChildToParent(normId, g.graph[normId][parentNormId], g.items[parentNormId])
        pathSet(updates, normId, parentNormId)(true)
      }
      else {
        const diff = generateDiff(normId, g.graph[normId][parentNormId], g.items[parentNormId])
        mergeItem(parentOrm, parentNormId, diff, null)
      }
    }
  }
}

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

const generateInst = diff => Array.isArray(diff) ? [] : isPlainObject(diff) ? {} : diff

const generateDiff = (normId, graphLevel, parentLevel) => {
  for (let key in graphLevel) {
    if (graphLevel[key] === theEnd) return g.items[normId]
    else {
      const level = Array.isArray(parentLevel) ? [...parentLevel] : {}
      level[key] = generateDiff(normId, graphLevel[key], parentLevel[key])
      return level
    }
  }
}

const setChildToParent = (normId, graphLevel, parentLevel) => {
  for (let key in graphLevel) {
    if (key === theEnd) parentLevel[key] = g.items[normId]
    else setChildToParent(normId, graphLevel[key], parentLevel[key])
  }
}
