import g from '*/global'
import { pathDecrement } from '*/utils/pathObj'

export const theCount = Symbol('theCount')
export const theEnd = Symbol('theEnd')

export const relationsIncrement = (childNormId, parentNormId, stack) => {
  if (!parentNormId) return
  let pathToChild
  // can't use just stack because parent can contain several childs 
  // ...and first path will rewrited by second
  if (!g.graph[childNormId]) {
    g.graph[childNormId] = {}
  }
  if (!g.graph[childNormId][parentNormId]) {
    pathToChild = g.graph[childNormId][parentNormId] = { [theCount]: 1 }
  }
  else {
    pathToChild = g.graph[childNormId][parentNormId]
    pathToChild[theCount]++
  }

  for (let i = 1; i < stack.length; i++) {
    const key = stack[i]
    if (i === stack.length - 1) pathToChild[key] = theEnd
    else {
      if (pathToChild[key]) pathToChild[theCount]++
      else pathToChild[key] = { [theCount]: 1 }
      pathToChild = pathToChild[key]
    }
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
