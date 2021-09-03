import g from '*/global'
import { pathDecrement } from '*/utils/pathObj'

export const theEnd = Symbol('theEnd')

export const relationsIncrement = (childNormId, parentNormId, stack) => {
  if (!parentNormId) return
  let pathToChild
  const start = stack.indexOf(parentNormId) + 1
  // can't use just stack because parent can contain several childs 
  // ...and first path will rewrited by second
  if (!g.graph[childNormId]) {
    g.graph[childNormId] = {}
  }
  if (!g.graph[childNormId][parentNormId]) {
    pathToChild = g.graph[childNormId][parentNormId] = {}
  }
  else {
    pathToChild = g.graph[childNormId][parentNormId]
    for (let i = start; i < stack.length; i++) {
      const key = stack[i]
      if (pathToChild[key] === theEnd) return
      if (!pathToChild[key]) break
    }
  }

  for (let i = start; i < stack.length; i++) {
    const key = stack[i]
    if (i === stack.length - 1) pathToChild[key] = theEnd
    else {
      if (!pathToChild[key]) pathToChild[key] = {}
      pathToChild = pathToChild[key]
    }
  }
}

export const relationsDecrement = (childNormId, parentNormId, stack) => {
  if (!parentNormId) return

  let current = g.graph[childNormId][parentNormId]
  const start = stack.indexOf(parentNormId) + 1
  let i = start

  if (i === start) delete g.graph[parentNormId]
  else delete current[stack[i]]
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
    relationsDecrement(normId, parentNormId, stack)
  }
}

export const applyLoops = updates => {
  for (let normId of updates.keys()) {
    const item = g.items[normId]
    const graphParents = g.graph[normId]
    if (!graphParents) continue

    for (let parentNormId of updates.get(normId).keys()) {
      const graphLevel = graphParents[parentNormId]
      if (!graphLevel) continue
      for (let key in graphLevel)
        applyLoopToTheEnd(g.items[normId], g.items[parentNormId], graphLevel)
    }
  }
}

const applyLoopToTheEnd = (item, parentLevel, graphLevel) => {
  // console.log(item, parentLevel, graphLevel, key)
  for (let key in graphLevel) {
    if (graphLevel[key] === theEnd) parentLevel[key] = item
    else applyLoopToTheEnd(item, parentLevel[key], graphLevel[key])
  }
}
