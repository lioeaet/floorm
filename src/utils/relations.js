import g from '*/global'
import { pathDecrement } from '*/utils/pathObj'

export const applyRelations = (removedRelations, addedRelations) => {
  for (let normId in removedRelations)
    for (let parentNormId in removedRelations[normId])
      for (let i = 0; i < removedRelations[normId][parentNormId].length; i++)
        removeRelation(normId, parentNormId, removedRelations[normId][parentNormId][i])

  for (let normId in addedRelations)
    for (let parentNormId in addedRelations[normId])
      for (let i = 0; i < addedRelations[normId][parentNormId].length; i++)
        addRelation(normId, parentNormId, addedRelations[normId][parentNormId][i])
}

export const removeRelation = (normId, parentNormId, stack) => {
  if (!parentNormId) return

  let current = g.graph[normId]
  let removedKeyGraphLevel = current
  let keyToRemove = parentNormId

  for (let i = stack.indexOf(parentNormId); i < stack.length; i++) {
    current = current[stack[i]]

    if (current && typeof current !== 'string' && Object.keys(current).length > 1) {
      removedKeyGraphLevel = current
      keyToRemove = stack[i + 1]
    }
  }

  delete removedKeyGraphLevel[keyToRemove]
}

export const addRelation = (normId, parentNormId, stack) => {
  if (!parentNormId) return

  let pathToChild
  const start = stack.indexOf(parentNormId) + 1
  // Can't use just stack because parent can contain child several times
  // and first path will rewrited by second
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

export const prepareRelation = (relations, normId, parentNormId, stack) => {
  const itemRelations = relations[normId] || (relations[normId] = {})
  const itemParentRelations = itemRelations[parentNormId] || (itemRelations[parentNormId] = [])
  itemParentRelations.push(stack)
}
