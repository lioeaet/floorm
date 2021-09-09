const g = {
  items: {}, // { normId: item }
  graph: {}, // { childNormId: { parentNormId: { {...pathToChild}: true } } }
  ormsByNormId: {}, // { normId: orm }
  descriptions: {}, // { ormNormId: desc }
  arrChilds: new Map, // { array: { normId: true } }
}
console.log(g.items)
export default g
