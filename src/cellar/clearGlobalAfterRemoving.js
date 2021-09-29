import g from '*/global'
import { isPlainObject, extractId } from '*/utils'

export const clearGlobalAfterRemoving = (id, normId) => {
  for (let childNormId in (g.childs[normId] || {})) delete g.graph[childNormId][normId]
  for (let parentNormId in (g.graph[normId] || {})) delete g.childs[parentNormId][normId]

  const orm = g.orms[normId]
  delete g.ids[orm.name][id]
  delete g.orms[normId]
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

    if (Array.isArray(nextLevel)) g.arrChilds.delete(nextLevel)

    else if (isPlainObject(nextLevel) && !g.itemsMap.has(nextLevel))
      clearArrChilds(nextLevel)
  }
}
