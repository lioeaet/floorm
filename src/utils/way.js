const way = (current, ...keys) => {
  for (const key of keys) {
    current[key] = current.hasOwnProperty(key) ? current[key] : {}
    current = current[key]
  }
  return current
}

export const wayGet = (map, ...keys) => {
  const key = keys.pop()
  const parent = way(map, ...keys)
  return parent[key]
}

export const waySet = (obj, ...keys) => val => {
  const key = keys.pop()
  const parent = way(obj, ...keys)
  parent[key] = val
  return val
}

export const wayDelete = (map, ...keys) => {
  const key = keys.pop()
  const parent = wayGet(map, ...keys)
  const item = parent[key]
  delete parent[key]
  return item
}
