const path = (current, ...keys) => {
  for (const key of keys) {
    current[key] = current.hasOwnProperty(key) ? current[key] : {}
    current = current[key]
  }
  return current
}

export const pathGet = (map, ...keys) => {
  const key = keys.pop()
  const parent = path(map, ...keys)
  return parent[key]
}

export const pathSet = (map, ...keys) => val => {
  const key = keys.pop()
  const parent = path(map, ...keys)
  parent[key] = val
  return val
}

export const pathDelete = (map, ...keys) => {
  const key = keys.pop()
  const parent = pathGet(map, ...keys)
  const item = parent[key]
  delete parent[key]
  return item
}

export const pathIncrement = (map, ...keys) => {
  const key = keys.pop()
  const parent = path(map, ...keys)
  const val = parent[key] ? parent[key] : 1
  parent[key] = val
}

export const pathDecrement = (map, ...keys) => {
  const key = keys.pop()
  const parent = path(map, ...keys)
  const val = map[key] - 1
  if (!val) delete parent[key]
  else parent[key] = val
}
