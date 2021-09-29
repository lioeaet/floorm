import g from '*/global'
import { notify, extractId } from '*/utils'
import { mergeItem } from '*/cellar/merge'
import { updateParents } from '*/cellar/parents'
import { clearGlobalAfterRemoving } from '*/cellar/clearGlobalAfterRemoving'
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

  clearGlobalAfterRemoving(extractId(item), normId)

  g.isUpdateParents = false
  g.nextItems = {}
  g.currentGraph = {}
  g.iterationUpdates = {}
  g.prevItems = {}

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
