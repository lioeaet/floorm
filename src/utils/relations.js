import g from '*/global'

// Can't use just stack because parent can contain child several times
// and first way will rewrited by second
export const addRelation = (graph, normId, parentNormId, stack) => {
  if (!graph[normId]) graph[normId] = {}
  if (!parentNormId) return
  let way = graph[normId]

  for (let i = stack.indexOf(parentNormId); i < stack.length; i++) {
    const key = stack[i]
    if (i === stack.length - 1) way[key] = normId
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
    if (current && Object.keys(current).length > 1 && current !== normId) {
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
  return way === normId
}
