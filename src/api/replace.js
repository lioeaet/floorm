import g from '*/global'
import { theEnd, notify, isPlainObject, clone } from '*/utils'
import { put } from '*/api/put' 

export const replace = (normId, nextNormId, nextId) => {
  const parents = g.graph[normId]
  const childs = g.childs[normId]
  const diff = clone(g.items[normId])
  diff.id = nextId

  for (let parentNormId in parents) {
    if (normId === parentNormId) continue
    const parent = g.items[parentNormId]
    const parentOrm = g.ormsByNormId[parentNormId]
    const parentDiff = genParentDiff(parents[parentNormId], parent, normId, diff, parent.id)

    put(parentOrm, parentNormId, parentDiff)
  }

  if (g.childs[normId][normId]) {
    g.graph[nextNormId][nextNormId] = g.graph[normId][normId]
    g.childs[nextNormId][nextNormId] = true
  }

  for (let childNormId in childs) delete g.graph[childNormId][normId]
  for (let parentNormId in parents) delete g.childs[parentNormId][normId]
  delete g.ormsByNormId[normId]
  delete g.childs[normId]
  delete g.graph[normId]

  const item = g.items[normId]
  removeItemArrChilds(item)
  g.itemsMap.delete(item)
  delete g.items[normId]

  return g.items[nextNormId]
}

const genParentDiff = (graphLevel, level, childNormId, childNextItem, id) => {
  if (Array.isArray(level)) {
    const child = g.items[childNormId]
    return level.map(x => x === child ? childNextItem : x)
  }
  const diff = id ? { id } : {}

  for (let key in graphLevel)
    diff[key] = graphLevel[key] === theEnd
      ? childNextItem
      : genParentDiff(graphLevel[key], level[key], childNormId, childNextItem)

  return diff
}

const removeItemArrChilds = level => {
  for (let key in level) {
    if (Array.isArray(level[key])) g.arrChilds.delete(level[key])
    else if (isPlainObject(level[key]) && !g.itemsMap.has(level[key]))
      removeItemArrChilds(level[key])
  }
}
