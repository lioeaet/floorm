const g = {
  currentUpdatedAt: Date.now(),
  suspensePromises: new Map, // { normId: promise }
  updatedAt: new Map, // { normId: dateMs }
  ormsByNormId: new Map, // { normId: orm }
  parents: {}, // { normId: [normId] }
  items: {}, // { normId: item }
  childs: {}, // { normId: [normId] }
  fetchedAt: new Map, // { normId: dateMs }
  arrayChilds: new Map, // { array: { normId: true } }
  refetchingPromises: new Map, // { normId: promise }
  descriptions: withDescriptionResolver(new Map), // { orm: desc }
}

export default g

function withDescriptionResolver(map) {
  map.get = key => {
    const desc = Map.prototype.get.call(map, key)
    if (typeof desc === 'function') map.set(key, desc())
    return Map.prototype.get.call(map, key)
  }
  return map
}
