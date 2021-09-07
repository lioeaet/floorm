import g from '*/global'
import {
  normalizeId,
  extractId,
  relationsUpdateArrayRemovedChilds,
  applyRelations,
  applyLoops,
  isOrm,
  resolveDiff,
  isPlainObject,
  notify,
  cloneMap,
  pathSet as pathSetMap,
  pathGet as pathGetMap,
  cloneDeep
} from '*/utils'
import {
  pathSet
} from '*/utils/pathObj'

const stack = []

// if (Object.keys(graphRoadEnd[key]) > 1) graphRoadStart = graphRoadEnd, graphRoadKey = key
let graphRoadKey = null
let graphRoadStart = null

let updates = new Map // { normId: parentNormId: true }
let addedRelations = {} // { normId: parentNormId: stack }
let removedRelations = {} // { normId: parentNormId: stack }

export const putItem = (orm, normId, diff) => {
  diff = resolveDiff(diff, g.items[normId])
  updates = new Map
  addedRelations = {}
  removedRelations = {}

  mergeItem(orm, normId, diff)
  updateParents(updates)
  applyRelations(removedRelations, addedRelations)
  applyLoops(updates)
  notify(updates)

  return g.items[normId]
}

const mergeItem = (orm, normId, diff, parentNormId) => {
  const item = g.items[normId]

  g.ormsByNormId[normId] = orm

  if (normId && parentNormId)
    pathSet(addedRelations, normId, parentNormId)([...stack])

  if (updates.get(normId) && !pathGetMap(updates, normId, parentNormId))
    return g.items[normId]

  if (diff === item) return item

  const nextItem = updates.has(normId) ? g.items[normId] : generateInst(diff)
  const desc = g.descriptions.get(orm.normId)

  g.items[normId] = nextItem
  pathSetMap(updates, normId, parentNormId)(true)

  stack.push(normId)
  merge(desc, item, diff, normId, nextItem)
  stack.pop()

  return nextItem
}

const merge = (desc, inst, diff, parentNormId, nextInst) => {
  diff = resolveDiff(diff, inst)
  if (!diff) return diff

  if (isOrm(desc)) {
    const id = extractId(diff)
    const prevId = extractId(inst)
    const normId = normalizeId(desc.name, id)

    if (prevId && id !== prevId) {
      const prevNormId = normalizeId(desc.name, prevId)
      if (prevNormId && parentNormId)
        pathSet(removedRelations, prevNormId, parentNormId)(stack)
    }

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
    // todo: someth
    if (Array.isArray(desc)) {
      const childOrm = desc[0]
      const prevChilds = g.arrayChilds.get(inst) || new Map
      const nextChilds = new Map

      diff.forEach((childDiff, i) => {
        const childId = extractId(childDiff)
        const childNormId = normalizeId(childOrm.name, childId)
        const prevI = prevChilds.get(childNormId)

        nextChilds.set(childNormId, i)
        stack.push(i)

        if (parentNormId && inst && prevI !== i) {
          const prevINormId = normalizeId(childOrm.name, extractId(inst[i]))
          const stackClone = [...stack]

          pathSet(removedRelations, prevINormId, parentNormId)(stackClone)
          pathSet(addedRelations, childNormId, parentNormId)(stackClone)
        }

        nextInst[i] = mergeItem(childOrm, childNormId, childDiff, parentNormId)
        stack.pop()
      })

      if (parentNormId) {
        if (inst && inst.length > diff.length) {
          for (let i = diff.length; i < inst.length; i++) {
            const childNormId = normalizeId(childOrm.name, extractId(inst[i]))

            pathSet(removedRelations, childNormId, parentNormId)([...stack, i])
          }
        }
      }

      g.arrayChilds.delete(inst)
      g.arrayChilds.set(nextInst, nextChilds)

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
        pathSetMap(updates, normId, parentNormId)(true)
      }
      else {
        const diff = generateDiff(normId, g.graph[normId][parentNormId], g.items[parentNormId])
        mergeItem(parentOrm, parentNormId, diff)
      }
    }
  }
}

const generateInst = diff => Array.isArray(diff) ? [] : isPlainObject(diff) ? {} : diff

const generateDiff = (normId, parentGraphLevel, parentLevel) => {
  const diff = Array.isArray(parentLevel) ? [...parentLevel] : {}

  for (let key in parentGraphLevel) {
    diff[key] = parentGraphLevel[key] === normId
      ? g.items[normId]
      : generateDiff(normId, parentGraphLevel[key], diff[key])

    return diff
  }
}

const setChildToParent = (normId, graphLevel, parentLevel) => {
  for (let key in graphLevel) {
    if (graphLevel[key] === normId) parentLevel[key] = g.items[normId]
    else setChildToParent(normId, graphLevel[key], parentLevel[key])
  }
}
