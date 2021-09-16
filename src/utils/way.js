const way = (current, ...keys) => {
  for (const key of keys) {
    current[key] = current.hasOwnProperty(key) ? current[key] : {}
    current = current[key]
  }
  return current
}

export const waySet = (obj, ...keys) => val => {
  const key = keys.pop()
  const parent = way(obj, ...keys)
  parent[key] = val
  return val
}
