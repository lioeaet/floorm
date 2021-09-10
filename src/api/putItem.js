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

let putUpdates = {} // { normId: true }
let currentUpdates = {} // { normId: true }
let addedRelations = {} // { normId: parentNormId: stack }
let removedRelations = {} // { normId: parentNormId: stack }

export const putItem = (orm, normId, diff) => {
  console.log('put', normId)
  diff = resolveDiff(diff, g.items[normId])
  putUpdates = {}
  currentUpdates = {}
  addedRelations = {}
  removedRelations = {}

  mergeItem(orm, normId, diff)
  applyRelations(removedRelations, addedRelations)
  updateParents()
  notify(putUpdates)

  return g.items[normId]
}

const mergeItem = (orm, normId, diff, parentNormId) => {
  const item = g.items[normId]

  g.ormsByNormId[normId] = orm

  if (diff === item) return item

  if (normId && parentNormId && !pathGet(g.graph, normId, parentNormId))
    prepareRelation(addedRelations, normId, parentNormId, [...stack])

  const nextItem = putUpdates[normId] ? g.items[normId] : generateInst(diff)
  const desc = g.descFuncs[orm.normId]()

  g.items[normId] = nextItem
  putUpdates[normId] = true
  currentUpdates[normId] = true

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
  for (let normId in currentUpdates) {
    const parents = g.graph[normId]
    if (!parents) continue

    for (let parentNormId in parents) {
      const parentOrm = g.ormsByNormId[parentNormId]

      if (!putUpdates[parentNormId]) {
        const parent = g.items[parentNormId]
        const diff = generateParentDiff(parent.id, g.graph[normId][parentNormId], parent, normId)
        currentUpdates = {}
        mergeItem(parentOrm, parentNormId, diff)
        updateParents()
      }
      const graph = g.graph[parentNormId] && g.graph[parentNormId][normId]
      if (graph) setChildToParent(parentNormId, normId, graph, g.items[normId])
    }
  }
}

const generateInst = diff => Array.isArray(diff) ? [] : isPlainObject(diff) ? {} : diff

const generateParentDiff = (id, graphLevel, level, childNormId) => {
  const isArray = Array.isArray(level)
  const diff = isArray ? [...level] : { id }

  for (let key in graphLevel)
    diff[key] = graphLevel[key] === childNormId
      ? g.items[childNormId]
      : generateParentDiff(id, graphLevel[key], level[key], childNormId)

  return diff
}

const setChildToParent = (normId, parentNormId, graphLevel, parentLevel) => {
  for (let key in graphLevel) {
    if (isPlainObject(graphLevel)) setChildToParent(normId, parentNormId, graphLevel[key], parentLevel[key])
    else if (key === normId) parentLevel[key] === g.items[normId]
  }
}
