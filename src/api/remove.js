import g from '*/global'
import { mergeItem, updateParents, clearGlobalAfterRemoving, theEnd } from '*/utils'

export const remove = normId => {
  const parents = g.graph[normId]

  for (let parentNormId in parents) {
    if (normId === parentNormId) continue
    const parent = g.items[parentNormId]
    const parentOrm = g.ormsByNormId[parentNormId]
    const parentDiff = genParentDiff(parents[parentNormId], parent, normId, parent.id)

    mergeItem(parentOrm, parentNormId, parentDiff)
  }
  updateParents()
  clearGlobalAfterRemoving(normId)

  g.isUpdateParents = false
  g.nextItems = {}
  g.currentGraph = {}
  g.iterationUpdates = {}

  return g.items[normId]
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
