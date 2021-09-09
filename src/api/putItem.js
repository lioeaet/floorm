import g from '*/global'
import {
  normalizeId,
  extractId,
  prepareRelation,
  applyRelations,
  isOrm,
  resolveDiff,
  isPlainObject,
  notify,
  clone,
} from '*/utils'
import {
  pathSet,
  pathGet
} from '*/utils/pathObj'

const stack = []

let updates = {} // { normId: parentNormId: true }
let addedRelations = {} // { normId: parentNormId: stack }
let removedRelations = {} // { normId: parentNormId: stack }

export const putItem = (orm, normId, diff) => {
  diff = resolveDiff(diff, g.items[normId])
  updates = {}
  addedRelations = {}
  removedRelations = {}

  mergeItem(orm, normId, diff)
  updateParents(updates)
  applyRelations(removedRelations, addedRelations)
  notify(updates)

  return g.items[normId]
}

console.log(g.items)

const mergeItem = (orm, normId, diff, parentNormId) => {
  const item = g.items[normId]

  g.ormsByNormId[normId] = orm

  if (normId && parentNormId)
    prepareRelation(addedRelations, normId, parentNormId, [...stack])

  if (updates[normId] && !pathGet(updates, normId, parentNormId))
    return g.items[normId]

  if (diff === item) return item

  const nextItem = updates[normId] ? g.items[normId] : generateInst(diff)
  const desc = g.descriptions.get(orm.normId)

  g.items[normId] = nextItem
  pathSet(updates, normId, parentNormId)(true)

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
        prepareRelation(removedRelations, prevNormId, parentNormId, [...stack])
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
    if (Array.isArray(desc)) {
      const childOrm = desc[0]
      const prevChilds = g.arrChilds.get(inst) || {}
      const nextChilds = {}

      for (let i = 0; i < diff.length; i++) {
        const childDiff = diff[i]
        const childNormId = normalizeId(childOrm.name, extractId(childDiff))
        const prevChildPlaces = prevChilds[childNormId] || {}
        const childPlaces = nextChilds[childNormId] || {}

        childPlaces[i] = true
        nextChilds[childNormId] = childPlaces
        stack.push(i)

        if (inst && !prevChildPlaces[i]) {
          const placePrevNormId = normalizeId(childOrm.name, extractId(inst[i]))
          const stackClone = [...stack]

          prepareRelation(removedRelations, placePrevNormId, parentNormId, stackClone)
        }

        nextInst[i] = mergeItem(childOrm, childNormId, childDiff, parentNormId)
        stack.pop()
      }

      if (inst && inst.length > diff.length) {
        for (let i = diff.length; i < inst.length; i++) {
          const childNormId = normalizeId(childOrm.name, extractId(inst[i]))

          prepareRelation(removedRelations, childNormId, parentNormId, [...stack, i])
        }
      }

      g.arrChilds.delete(inst)
      g.arrChilds.set(nextInst, nextChilds)

      return nextInst
    }
    else diff.forEach((item, i) => (nextInst[i] = item))
  }

  return nextInst
}

const updateParents = () => {
  for (let normId in updates) {
    const parents = g.graph[normId]
    if (!parents) continue

    for (let parentNormId in parents) {
      if (updates[normId] && updates[normId][parentNormId])
        continue

      const parentOrm = g.ormsByNormId[parentNormId]

      if (updates[parentNormId]) {
        updates[normId][parentNormId]
        setChildToParent(normId, g.graph[normId][parentNormId], g.items[parentNormId])
        pathSet(updates, normId, parentNormId)(true)
      }
      else {
        const diff = generateParentDiff(normId, g.graph[normId][parentNormId], g.items[parentNormId])
        mergeItem(parentOrm, parentNormId, diff)
      }
    }
  }
}

const generateInst = diff => Array.isArray(diff) ? [] : isPlainObject(diff) ? {} : diff

const generateParentDiff = (normId, parentGraphLevel, parentLevel) => {
  const isArray = Array.isArray(parentLevel)
  const diff = isArray ? [...parentLevel] : {}

  for (let key in parentGraphLevel)
    diff[key] = parentGraphLevel[key] === normId
      ? g.items[normId]
      : generateParentDiff(normId, parentGraphLevel[key], parentLevel[key])

  return diff
}

const setChildToParent = (normId, graphLevel, parentLevel) => {
  for (let key in graphLevel) {
    if (graphLevel[key] === normId) parentLevel[key] = g.items[normId]
    else {
      setChildToParent(normId, graphLevel[key], parentLevel[key])
    }
  }
}
