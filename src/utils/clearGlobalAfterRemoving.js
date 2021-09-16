import g from '*/global'
import { isPlainObject } from '*/utils'

export const clearGlobalAfterRemoving = normId => {
  for (let childNormId in g.childs) delete g.graph[childNormId][normId]
  for (let parentNormId in g.parents) delete g.childs[parentNormId][normId]
  delete g.ormsByNormId[normId]
  delete g.childs[normId]
  delete g.graph[normId]

  const item = g.items[normId]
  clearArrChilds(item)
  g.itemsMap.delete(item)
  delete g.items[normId]
}

const clearArrChilds = level => {
  for (let key in level) {
    const nextLevel = level[key]

    if (Array.isArray(nextLevel)) {
      g.arrChilds.delete(nextLevel)
    }
    else if (isPlainObject(nextLevel) && !g.itemsMap.has(nextLevel))
      clearArrChilds(nextLevel)
  }
}
