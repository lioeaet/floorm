import g from '*/global'
import { pathSet, pathIncrement, pathDecrement } from '*/utils/pathObj'

export const relationsIncrement = (childNormId, parentNormId) => {
  if (!parentNormId) return
  const shouldRefresh = g.updatedAt.get(childNormId) < g.currentUpdatedAt
  if (shouldRefresh) {
    pathSet(g.parents, childNormId, parentNormId)(1)
  } else {
    pathIncrement(g.parents, childNormId, parentNormId)
  }
}

export const relationsDecrement = (childNormId, parentNormId) => {
  if (!parentNormId) return
  pathDecrement(g.parents, childNormId, parentNormId)
}

export const relationsUpdateArrayRemovedChilds = (
  prevArray,
  nextArray,
  nextChilds,
  parentNormId
) => {
  const prevChilds = g.arrayChilds.get(prevArray)
  g.arrayChilds.set(nextArray, nextChilds)
  if (!prevChilds) return

  for (let normId of prevChilds.keys()) {
    if (nextChilds.has(normId)) continue
    relationsDecrement(normId, parentNormId)
  }
}
