import g from '*/global'
import { theEnd, notify, extractId } from '*/utils'
import { putItem } from '*/api/putItem' 

export const removeItem = normId => {
  const item = g.items[normId]
  g.items[normId] = null
  const parents = g.graph[normId]
  const childs = g.childs[normId]
  delete parents[normId]

  for (let parentNormId in parents) {
    if (normId === parentNormId) continue
    const parent = g.items[parentNormId]
    const parentOrm = g.ormsByNormId[parentNormId]
    const parentDiff = genParentDiff(parents[parentNormId], parent, normId, parent.id)

    putItem(parentOrm, parentNormId, parentDiff)
  }
  for (let childNormId in childs)
    if (g.graph[childNormId]) delete g.graph[childNormId][normId]
  for (let parentNormId in parents)
    if (g.childs[parentNormId]) delete g.childs[parentNormId][normId]
  delete g.items[normId]
  delete g.ormsByNormId[normId]
  delete g.childs[normId]
  delete g.graph[normId]
  // g.arrChilds

  // notify(updatedIds)

  return item.id
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
      ? null
      : genParentDiff(graphLevel[key], level[key], childNormId)

  return diff
}

const removeArrChilds = () => {}
