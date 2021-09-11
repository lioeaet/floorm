import g from '*/global'
import {
  normalizeId,
  extractId,
  applyRelations,
  isOrm,
  isPlainObject,
  notify,
  addRelation,
  hasRelation,
  removeRelation,
  clone,
} from '*/utils'
import {
  pathSet,
  pathGet
} from '*/utils/pathObj'

const stack = []

let putUpdates = {} // { normId: true }
let updatedItems = {} // { normId: item }
let currentUpdates = {} // { normId: true }

export const putItem = (orm, normId, diff) => {
  console.log('putItem', normId, orm, diff)
  putUpdates = {}
  updatedItems = {}
  currentUpdates = {}

  mergeItem(orm, normId, diff)
  updateParents()
  notify(putUpdates)

  return g.items[normId]
}

const mergeItem = (orm, normId, diff, parentNormId) => {
  const item = g.items[normId]
  console.log('mergeItem', normId, parentNormId, clone(item), clone(diff), clone(stack), hasRelation(putUpdates, normId, parentNormId, stack))
  g.ormsByNormId[normId] = orm
  const nextItem = updatedItems[normId] || (updatedItems[normId] = {})

  if (hasRelation(putUpdates, normId, parentNormId, stack)) return nextItem
  addRelation(g.graph, normId, parentNormId, stack)
  addRelation(putUpdates, normId, parentNormId, stack)
  if (normId === stack[0]) return nextItem

  currentUpdates[normId] = true

  stack.push(normId)
  g.items[normId] = merge(g.descFuncs[orm.normId](), item, diff, nextItem, normId)
  stack.pop()

  return nextItem
}

const merge = (desc, inst, diff, nextInst, parentNormId) => {
  if (isOrm(desc)) {
    const id = extractId(diff)
    const prevId = extractId(inst)
    const normId = normalizeId(desc.name, id)

    if (prevId && id !== prevId) {
      const prevNormId = normalizeId(desc.name, prevId)
      if (prevNormId && parentNormId)
        removeRelation(g.graph, prevNormId, parentNormId, stack)
    }

    return mergeItem(desc, normId, diff, parentNormId)
  }

  if (isPlainObject(diff)) {
    for (let key in diff) {
      const keyDesc = desc && desc[key]
      const keyValue = inst && inst[key]

      stack.push(key)
      nextInst[key] = merge(keyDesc, keyValue, diff[key], generateInst(diff[key]), parentNormId)
      stack.pop()
    }
    if (isPlainObject(inst))
      for (let key in inst)
        if (!nextInst.hasOwnProperty(key)) {
          const keyDesc = desc && desc[key]
          const keyValue = inst && inst[key]

          stack.push(key)
          nextInst[key] = merge(keyDesc, keyValue, keyValue, generateInst(keyValue), parentNormId)
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

        if (inst && inst[i] && !prevChildPlaces[i]) {
          const placePrevNormId = normalizeId(childOrm.name, extractId(inst[i]))
          if (placePrevNormId) removeRelation(g.graph, placePrevNormId, parentNormId, stack)
        }

        nextInst[i] = mergeItem(childOrm, childNormId, childDiff, parentNormId)
        stack.pop()
      }

      if (inst && inst.length > diff.length) {
        for (let i = diff.length; i < inst.length; i++) {
          const childNormId = normalizeId(childOrm.name, extractId(inst[i]))
          stack.push(i)
          removeRelation(g.graph, childNormId, parentNormId, stack)
          stack.pop(i)
        }
      }

      g.arrChilds.delete(inst)
      g.arrChilds.set(diff, nextChilds)

      return nextInst
    }
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
  const diff = Array.isArray(level) ? [...level] : { id }

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
