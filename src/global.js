const g = {
  isUpdateParents: false,
  arrChilds: new Map,  // { array: { normId: true } }
  itemsMap: new Map,   // { item: true }
  stack: [],           // [...normId]
  items: {},           // { normId: item }
  graph: {},           // { normId: { parentNormId: { ...waysToChild: true } } }
  childs: {},          // { normId: { childNormId: true } }
  nextItems: {},       // { normId: item }
  descFuncs: {},       // { ormName: descFunc }
  currentGraph: {},    // { normId: { parentNormId: ...waysToChild: true } }
  ormsByNormId: {},    // { normId: orm }
  iterationUpdates: {} // { normId: true }
}
console.log(g)
export default g
