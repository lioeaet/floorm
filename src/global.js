const g = {
  iterationUpdates: {}, // { normId: true }
  arrChilds: new Map,   // { array: { normId: true } }
  itemsMap: new Map,    // { item: true }
  descFuncs: {},        // { ormName: descFunc }
  stack: [],            // [...normId]
  items: {},            // { normId: item }
  orms: {},             // { (normId | ormName): orm }
  ids: {},              // { ormName: { id: true } }
  graph: {},            // { normId: { parentNormId: { ...waysToChild: true } } }
  childs: {},           // { normId: { childNormId: true } }
  prevItems: {},        // { normId: prev }
  nextItems: {},        // { normId: item }
  currentGraph: {},     // { normId: { parentNormId: ...waysToChild: true } }
  isUpdateParents: false,
}
console.log(g)
window.g = g
export default g
