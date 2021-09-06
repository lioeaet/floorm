import g from '*/global'
import { pathDecrement } from '*/utils/pathObj'

export const addRelation = (normId, parentNormId, stack) => {
  if (!parentNormId) return

  let pathToChild
  const start = stack.indexOf(parentNormId) + 1
  // can't use just stack because parent can contain several childs 
  // ...and first path will rewrited by second
  if (!g.graph[normId]) g.graph[normId] = {}

  if (!g.graph[normId][parentNormId]) {
    pathToChild = g.graph[normId][parentNormId] = {}
  }
  else {
    pathToChild = g.graph[normId][parentNormId]

    for (let i = start; i < stack.length; i++) {
      const key = stack[i]

      if (pathToChild[key] === normId) return
      if (!pathToChild[key]) break
    }
  }

  for (let i = start; i < stack.length; i++) {
    const key = stack[i]
    if (i === stack.length - 1) pathToChild[key] = normId
    else {
      if (!pathToChild[key]) pathToChild[key] = {}
      pathToChild = pathToChild[key]
    }
  }
}

export const removeRelation = (normId, parentNormId, stack) => {
  if (!parentNormId) return

  let current = g.graph[normId]
  let removedKeyGraphLevel = current
  let keyToRemove = parentNormId

  for (let i = stack.indexOf(parentNormId); i < stack.length; i++) {
    current = current[stack[i]]

    if (current && Object.keys(current).length > 1) {
      removedKeyGraphLevel = current
      keyToRemove = stack[i + 1]
    }
  }

  delete removedKeyGraphLevel[keyToRemove]
}

export const applyRelations = (removedRelations, addedRelations) => {
  for (let normId in removedRelations) 
    for (let parentNormId in removedRelations[normId])
      removeRelation(normId, parentNormId, removedRelations[normId][parentNormId])

  for (let normId in addedRelations)
    for (let parentNormId in addedRelations[normId])
      addRelation(normId, parentNormId, addedRelations[normId][parentNormId])
}

export const relationsUpdateArrayRemovedChilds = (
  prevArray,
  nextArray,
  nextChilds,
  parentNormId,
  stack
) => {
  const prevChilds = g.arrayChilds.get(prevArray)
  g.arrayChilds.set(nextArray, nextChilds)
  if (!prevChilds) return

  for (let normId of prevChilds.keys()) {
    if (nextChilds.has(normId)) continue
    removeRelation(normId, parentNormId, stack)
  }
}

export const applyLoops = updates => {
  for (let normId of updates.keys()) {
    const graphParents = g.graph[normId]
    if (!graphParents) continue

    for (let parentNormId of updates.get(normId).keys()) {
      const graphLevel = graphParents[parentNormId]
      if (!graphLevel) continue
      for (let key in graphLevel)
        applyLoopToTheEnd(normId, g.items[parentNormId], graphLevel)
    }
  }
}

const applyLoopToTheEnd = (normId, parentLevel, graphLevel) => {
  for (let key in graphLevel) {
    if (graphLevel[key] === normId) parentLevel[key] = g.items[normId]
    else applyLoopToTheEnd(normId, parentLevel[key], graphLevel[key])
  }
}
