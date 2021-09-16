import g from '*/global'
import { theEnd, notify, clone } from '*/utils'
import { put } from '*/api/put' 

export const remove = normId => {
  const parents = g.graph[normId]
  const childs = g.childs[normId]

  for (let parentNormId in parents) {
    if (normId === parentNormId) continue
    const parent = g.items[parentNormId]
    const parentOrm = g.ormsByNormId[parentNormId]
    const parentDiff = genParentDiff(parents[parentNormId], parent, normId, parent.id)

    put(parentOrm, parentNormId, parentDiff)
  }

  for (let childNormId in childs) delete g.graph[childNormId][normId]
  for (let parentNormId in parents) delete g.childs[parentNormId][normId]
  delete g.ormsByNormId[normId]
  delete g.childs[normId]
  delete g.graph[normId]

  // here is new item instance after put
  const item = g.items[normId]
  removeItemArrChilds(item)
  g.itemsMap.delete(item)
  delete g.items[normId]

  // notify(updatedIds)

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

const removeItemArrChilds = level => {
  for (let key in level) {
    if (Array.isArray(level[key])) g.arrChilds.delete(level[key])
    else if (g.itemsMap.has(level[key])) continue
    else removeItemArrChilds(level[key])
  }
}
