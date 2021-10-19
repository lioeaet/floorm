import { clone } from 'utils'
import { theEnd } from '*/cellar/relations'

const flat = (orm, normId) => {
  const parents = g.graph[normId]

  let result = {}
  for (let key in childs) {
    const childNormId = childs[key]
    const graph = g.graph[normId][childNormId]
    deleteChilds(graph, result)
  }
}

const applyChilds = (gLevel, currentGraph, parentNormId) {
  for (let key in gLevel) {
    if (gLevel[key] === theEnd) {
      if (stack.includes)
    }
    g.stack.push(key)

    g.stack.pop()
  }
}

const deleteChilds = (gLevel, level) => {
  if (Array.isArray(gLevel)) {
    if (isOrm(gLevel[0])) 
  }
}
