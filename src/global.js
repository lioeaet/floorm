const g = {
  suspensePromises: new Map, // { normId: promise }
  ormsByNormId: {}, // { normId: orm }
  items: {}, // { normId: item }
  fetchedAt: new Map, // { normId: dateMs }
  arrayChilds: new Map, // { array: { normId: true } }
  refetchingPromises: new Map, // { normId: promise }
  descriptions: withDescriptionResolver(new Map), // { orm: desc }

  graph: {} // { childNormId: { parentNormId: { {...pathToChild}: true } } }
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
