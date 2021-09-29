import g from '*/global'
import { isPlainObject, notify, extractId } from '*/utils'
import { mergeItem } from '*/cellar/merge'
import { updateParents } from '*/cellar/parents'
import { theEnd } from '*/cellar/relations'

export const remove = normId => {
  const parents = g.graph[normId]

  g.isUpdateParents = true

  for (let parentNormId in parents) {
    if (normId === parentNormId) continue
    const parent = g.items[parentNormId]
    const parentOrm = g.orms[parentNormId]
    const parentDiff = genParentDiff(parents[parentNormId], parent, normId, parent.id)

    mergeItem(parentOrm, parentNormId, parentDiff)
  }
  updateParents()

  const item = g.items[normId]
  g.itemsMap.delete(item)
  g.prevItems[normId] = item
  g.items[normId] = null
  g.nextItems[normId] = null
  notify(g.nextItems)
  g.isUpdateParents = false
  g.nextItems = {}
  g.currentGraph = {}
  g.iterationUpdates = {}
  g.prevItems = {}
  for (let childNormId in (g.childs[normId] || {})) delete g.graph[childNormId][normId]
  for (let parentNormId in (g.graph[normId] || {})) delete g.childs[parentNormId][normId]

  const orm = g.orms[normId]
  delete g.ids[orm.name][extractId(item)]
  delete g.orms[normId]
  delete g.childs[normId]
  delete g.graph[normId]

  clearArrChilds(item)
  g.itemsMap.delete(item)
  delete g.items[normId]
  return item.id
}

const genParentDiff = (graphLevel, level, childNormId, id) => {
  if (Array.isArray(level)) {
    const child = g.items[childNormId]
    return level.filter(x => x !== child)
  }
  const diff = id ? { id } : {}

  for (let key in graphLevel)
    diff[key] = graphLevel[key] === theEnd
      ? null
      : genParentDiff(graphLevel[key], level[key], childNormId)

  return diff
}

const clearArrChilds = level => {
  for (let key in level) {
    const nextLevel = level[key]

    if (Array.isArray(nextLevel)) g.arrChilds.delete(nextLevel)

    else if (isPlainObject(nextLevel) && !g.itemsMap.has(nextLevel))
      clearArrChilds(nextLevel)
  }
}
