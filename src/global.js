const g = {
  items: {}, // { normId: item }
  graph: {}, // { childNormId: { parentNormId: { {...pathToChild}: true } } }
  ormsByNormId: {}, // { normId: orm }
  descFuncs: {}, // { ormNormId: descFunc }
  arrChilds: new Map, // { array: { normId: true } }
}
console.log(g)
export default g
