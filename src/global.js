const g = {
  isUpdateParents: false,
  arrChilds: new Map,   // { array: { normId: true } }
  itemsMap: new Map,    // { item: true }
  stack: [],            // [...normId]
  items: {},            // { normId: item }
  graph: {},            // { normId: { parentNormId: { ...waysToChild: true } } }
  childs: {},           // { normId: { childNormId: true } }
  nextItems: {},        // { normId: item }
  descFuncs: {},        // { ormName: descFunc }
  currentGraph: {},     // { normId: { parentNormId: ...waysToChild: true } }
  orms: {},             // { (normId | ormName): orm }
  iterationUpdates: {}, // { normId: true }
  ids: {},              // { ormName: { id: true } }
  prevItems: {}
}
console.log(g)
window.g = g
export default g
