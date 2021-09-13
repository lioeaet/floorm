import g from '*/global'
import { theEnd, notify, extractId } from '*/utils'
import { putItem } from '*/api/putItem' 

export const removeItem = normId => {
  const item = g.items[normId]
  const parents = g.graph[normId]
  const childs = g.childs[normId]
  delete parents[normId]

  for (let parentNormId in parents) {
    const parent = g.items[parentNormId]
    const parentOrm = g.ormsByNormId[parentNormId]

    // console.log(parentNormId, genParentDiff(parents[parentNormId], parent, normId, parent.id))
    putItem(parentOrm, parentNormId, genParentDiff(parents[parentNormId], parent, normId, parent.id))
  }
  delete g.items[normId]
  delete g.childs[normId]
  delete g.ormsByNormId[normId]
  for (let childNormId in childs)
    if (g.graph[childNormId]) delete g.graph[childNormId][normId]
  delete g.graph[normId]

  // notify(updatedIds)

  return item
}

const genParentDiff = (graphLevel, level, childNormId, id) => {
  let diff
  if (Array.isArray(level)) {
    const child = g.items[childNormId]
    return level.filter(x => x !== child)
  }
  else diff = id ? { id } : {}

  for (let key in graphLevel)
    diff[key] = graphLevel[key] === theEnd
      ? void ''
      : genParentDiff(graphLevel[key], level[key], childNormId)

  return diff
}
