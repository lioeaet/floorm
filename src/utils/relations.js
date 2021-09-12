import g from '*/global'

export const theEnd = Symbol('theEnd')

// Can't use just stack because parent can contain child several times
// and first way will rewrited by second
export const addRelation = (graph, normId, parentNormId, stack) => {
  if (!graph[normId]) graph[normId] = {}
  if (!parentNormId) return
  let way = graph[normId]

  for (let i = stack.indexOf(parentNormId); i < stack.length; i++) {
    const key = stack[i]
    if (i === stack.length - 1) way[key] = theEnd
    else way = way[key] || (way[key] = {})
  }
}

export const removeRelation = (graph, normId, parentNormId, stack) => {
  if (!parentNormId) return

  let current = g.graph[normId]
  let graphLevel = current
  let key = parentNormId

  for (let i = stack.indexOf(parentNormId); i < stack.length; i++) {
    current = current[stack[i]]
    if (!current) break
    else if (Object.keys(current).length > 1) {
      graphLevel = current
      key = stack[i + 1]
    }
  }
  delete graphLevel[key]
}

export const hasRelation = (graph, normId, parentNormId, stack) => {
  if (!parentNormId || !graph[normId]) return false
  let way = graph[normId]

  for (let i = stack.indexOf(parentNormId); i < stack.length; i++) {
    const key = stack[i]
    if (way[key]) way = way[key]
    else break
  }
  return way === theEnd
}

export const hasAllRelations = (upGraph, gGraph) => {
  if (gGraph === theEnd) return upGraph === theEnd
  if (!upGraph) return false

  let has = true
  for (let key in gGraph) {
    has = hasAllRelations(upGraph[key], gGraph[key])
    if (!has) break
  }
  return has
}
