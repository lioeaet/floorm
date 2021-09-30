const g = {
  isUpdateParents: false,
  iterationUpdates: {}, // { normId: true }
  itemsMap: new Map,    // { item: true }
  descFuncs: {},        // { ormName: descFunc }
  stack: [],            // [...normId]
  orms: {},             // { (normId | ormName): orm }
  ids: {},              // { ormName: { id: true } }
  graph: {},            // { normId: { parentNormId: { ...waysToChild: true } } }
  items: {},            // { normId: item }
  childs: {},           // { normId: { childNormId: true } }
  prevItems: {},        // { normId: prev }
  nextItems: {},        // { normId: item }
  currentGraph: {},     // { normId: { parentNormId: ...waysToChild: true } }
  arrChilds: new Map,   // { array: { normId: true } }
}
console.log(g)
window.g = g
export default g
