const g = {
  isUpdateParents: false,
  stack: [],           // [...normId]
  items: {},           // { normId: item }
  graph: {},           // { normId: { parentNormId: { ...waysToChild: true } } }
  childs: {},          // { normId: { childNormId: true } }
  ormsByNormId: {},    // { normId: orm }
  descFuncs: {},       // { ormName: descFunc }
  arrChilds: new Map,  // { array: { normId: true } }
  itemsMap: new Map,   // { item: true }
  itemListeners: {},   // { normId: [...listeners] }
  ormListeners: {},    // { name: [...listeners] }
  nextItems: {},       // { normId: item }
  currentGraph: {},    // { normId: { parentNormId: ...waysToChild: true } }
  iterationUpdates: {} // { normId: true }
}
console.log(g)
export default g
