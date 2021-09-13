const g = {
  items: {}, // { normId: item }
  graph: {}, // { normId: { parentNormId: { {...pathToChild}: true } } }
  childs: {}, // { normId: { childNormId: true } }
  ormsByNormId: {}, // { normId: orm }
  descFuncs: {}, // { ormName: descFunc }
  arrChilds: new Map, // { array: { normId: true } }
  itemsMap: new Map // { item: true }
}
console.log(g)
export default g
