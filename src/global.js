const g = {
  items: {}, // { normId: item }
  graph: {}, // { childNormId: { parentNormId: { {...pathToChild}: true } } }
  ormsByNormId: {}, // { normId: orm }
  descriptions: withDescriptionResolver(new Map), // { orm: desc }
  arrChilds: new Map, // { array: { normId: true } }
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
