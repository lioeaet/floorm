import g from '*/global'
import { waySet, isOrm, extractId, normalizeId, isPlainObject } from '*/utils'
import { removeRelation, hasRelation, addRelation } from '*/cellar/relations'

export const mergeItem = (orm, normId, diff, parentNormId) => {
  const item = g.items[normId]
  const nextItem = g.nextItems[normId] || (g.nextItems[normId] = {})

  if (!g.prevItems.hasOwnProperty(normId)) g.prevItems[normId] = item
  if (parentNormId) {
    if (hasRelation(g.currentGraph, normId, parentNormId, g.stack))
      return nextItem

    addRelation(g.currentGraph, normId, parentNormId, g.stack)
    addRelation(g.graph, normId, parentNormId, g.stack)
    waySet(g.childs, parentNormId, normId)(true)

    if (normId === parentNormId && normId !== g.stack[0])
      return nextItem

    if (g.isUpdateParents) {
      if (item === nextItem) return nextItem
      if (item === diff)
        if (!(g.childs[normId] || {}).hasOwnProperty(parentNormId)) {
          delete g.nextItems[normId]
          return item
        }
    }
  }
  g.itemsMap.delete(item)
  g.itemsMap.set(nextItem, true)

  if (g.stack.includes(normId)) {
    for (let key in diff)
      if (!nextItem.hasOwnProperty(key)) nextItem[key] = diff[key]
    return nextItem
  }
  g.iterationUpdates[normId] = true
  g.orms[normId] = orm
  g.stack.push(normId)
  g.items[normId] = merge(g.descFuncs[orm.name](), item, diff, nextItem, normId)
  g.stack.pop()
  return nextItem
}

const merge = (desc, inst, diff, nextInst, parentNormId) => {
  if (isOrm(desc)) {
    const id = extractId(diff)
    const prevId = extractId(inst)
    const normId = normalizeId(desc, id)

    if (prevId && id !== prevId) {
      const prevNormId = normalizeId(desc, prevId)
      if (prevNormId && parentNormId)
        removeRelation(g.graph, prevNormId, parentNormId, g.stack)
      if (!diff) return diff
    }
    return mergeItem(desc, normId, diff, parentNormId)
  }

  if (typeof desc === 'function') {
    const orm = desc(diff)
    const id = extractId(diff)
    const normId = normalizeId(orm, id)
    const prevOrm = inst && desc(inst)
    const prevId = extractId(inst)
    const prevNormId = prevOrm && normalizeId(prevOrm, prevId)

    if (prevNormId && normId !== prevNormId) {
      if (prevNormId && prevNormId && parentNormId)
        removeRelation(g.graph, prevNormId, parentNormId, g.stack)
      if (!diff) return diff
    }
    return mergeItem(orm, normId, diff, parentNormId)
  }

  if (isPlainObject(diff)) {
    for (let key in diff) {
      const keyDesc = desc && desc[key]
      const keyValue = inst && inst[key]

      g.stack.push(key)
      nextInst[key] = merge(keyDesc, keyValue, diff[key], genInst(diff[key]), parentNormId)
      g.stack.pop()
    }
    if (isPlainObject(inst))
      for (let key in inst)
        if (!nextInst.hasOwnProperty(key))
          nextInst[key] = inst[key]
    return nextInst
  }

  if (Array.isArray(diff)) {
    const childOrm = desc[0]
    const prevChilds = g.arrChilds.get(inst) || {}
    const nextChilds = {}

    for (let i = 0; i < diff.length; i++) {
      const childDiff = diff[i]
      const childNormId = normalizeId(childOrm, extractId(childDiff))
      const prevChildPlaces = prevChilds[childNormId] || {}
      const childPlaces = nextChilds[childNormId] || {}

      childPlaces[i] = true
      nextChilds[childNormId] = childPlaces
      g.stack.push(i)

      if (inst && inst[i] && !prevChildPlaces[i]) {
        const placePrevNormId = normalizeId(childOrm, extractId(inst[i]))
        if (placePrevNormId) removeRelation(g.graph, placePrevNormId, parentNormId, g.stack)
      }

      nextInst[i] = mergeItem(childOrm, childNormId, childDiff, parentNormId)
      g.stack.pop()
    }

    if (inst && inst.length > diff.length) {
      for (let i = diff.length; i < inst.length; i++) {
        const childNormId = normalizeId(childOrm, extractId(inst[i]))
        g.stack.push(i)
        removeRelation(g.graph, childNormId, parentNormId, g.stack)
        g.stack.pop(i)
      }
    }
    g.arrChilds.delete(inst)
    g.arrChilds.set(nextInst, nextChilds)

    return nextInst
  }
  return nextInst
}

const genInst = diff => Array.isArray(diff) ? [] : isPlainObject(diff) ? {} : diff
