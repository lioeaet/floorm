import g from '*/global'
import { mergeItem } from '*/utils/merge'
import { hasAllRelations, theEnd } from '*/utils'

export const updateParents = () => {
  g.isUpdateParents = true

  for (let normId in g.iterationUpdates) {
    const parents = g.graph[normId]
    if (!parents) continue

    for (let parentNormId in parents) {
      if (!g.currentGraph[normId] || !hasAllRelations(g.currentGraph[normId][parentNormId], g.graph[normId][parentNormId])) {
        const parent = g.items[parentNormId]
        const parentOrm = g.ormsByNormId[parentNormId]
        const parentDiff = genParentDiff(g.graph[normId][parentNormId], parent, normId, parent.id)
        g.iterationUpdates = {}
        mergeItem(parentOrm, parentNormId, parentDiff)
        updateParents()
      }
    }
  }
}

const genParentDiff = (graphLevel, level, childNormId, id) => {
  const diff = Array.isArray(level) ? [...level] : id ? { id } : {}

  for (let key in graphLevel)
    diff[key] = graphLevel[key] === theEnd
      ? g.items[childNormId]
      : genParentDiff(graphLevel[key], level[key], childNormId)

  return diff
}
