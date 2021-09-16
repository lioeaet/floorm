const g = {
  isUpdateParents: false,
  arrChilds: new Map,  // { array: { normId: true } }
  itemsMap: new Map,   // { item: true }
  ormsByNormId: {},    // { normId: orm }
  stack: [],           // [...normId]
  items: {},           // { normId: item }
  graph: {},           // { normId: { parentNormId: { ...waysToChild: true } } }
  childs: {},          // { normId: { childNormId: true } }
  nextItems: {},       // { normId: item }
  descFuncs: {},       // { ormName: descFunc }
  ormListeners: {},    // { name: [...listeners] }
  currentGraph: {},    // { normId: { parentNormId: ...waysToChild: true } }
  itemListeners: {},   // { normId: [...listeners] }
  iterationUpdates: {} // { normId: true }
}
console.log(g)
export default g
