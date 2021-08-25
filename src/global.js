export default {
  currentUpdatedAt: Date.now(),
  suspensePromises: new Map, // { normId: promise }
  updatedAt: new Map, // { normId: dateMs }
  ormsById: new Map, // { normId: orm }
  parents: new Map, // { normId: [normId] }
  items: new Map, // { normId: item }
  childs: new Map, // { normId: [normId] }
  fetchedAt: new Map, // { normId: dateMs }
  refreshes: new Map, // { normId: true }
  arrayChilds: new Map, // { array: { normId: true } }
  refetchingPromises: new Map, // { normId: promise }
  descriptions: withDescriptionResolver(new Map), // { orm: desc }
}

function withDescriptionResolver(map) {
  map.get = key => {
    const desc = Map.prototype.get.call(map, key)
    if (typeof desc === 'function') map.set(key, desc())
    return Map.prototype.get.call(map, key)
  }
  return map
}
