import { clone } from 'utils'
import { theEnd } from '*/cellar/relations'

const flat = (orm, normId) => {
  const parents = g.graph[normId]

  const graph = {}
  applyChilds(graph, parents)


  let flatter = {}
  for (let key in childs) {
    const childNormId = childs[key]
    const graph = g.graph[normId][childNormId]
    deleteChilds(graph, flatter)
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

// элементы имеют 2 уровня вложенности
// если элемент повторяется в стеке, то ставим ему копию до конца стека, где нет свойства с этим элементом
// в остальном строим граф, где такие элементы заканчиваются на true, а у других ставятся childs до конца
