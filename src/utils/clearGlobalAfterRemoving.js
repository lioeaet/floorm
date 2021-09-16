import g from '*/global'
import { isPlainObject } from '*/utils'

export const clearGlobalAfterRemoving = normId => {
  for (let childNormId in g.childs) delete g.graph[childNormId][normId]
  for (let parentNormId in g.parents) delete g.childs[parentNormId][normId]
  delete g.ormsByNormId[normId]
  delete g.childs[normId]
  delete g.graph[normId]

  const item = g.items[normId]
  removeItemArrChilds(item)
  g.itemsMap.delete(item)
  delete g.items[normId]
}

const removeItemArrChilds = level => {
  for (let key in level) {
    if (Array.isArray(level[key])) g.arrChilds.delete(level[key])
    else if (isPlainObject(level[key]) && !g.itemsMap.has(level[key]))
      removeItemArrChilds(level[key])
  }
}
