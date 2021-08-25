import g from '*/global'

export const isOrm = inst => g.descriptions.has(inst)

export const isPlainObject = inst =>
  inst && Object.getPrototypeOf(inst) === Object.getPrototypeOf({})

export const resolveDiff = (diff, level) =>
  typeof diff === 'function' ? diff(level) : diff

export const isPromise = inst => inst && typeof inst.then === 'function'

export const isFunction = inst => typeof inst === 'function'

export const extractId = (...itemModes) => {
  const itemWithId = itemModes.find(obj =>
    isPlainObject(obj) &&
    obj.hasOwnProperty('id')
  )
  if (itemWithId) return itemWithId.id
}

export const deferRefreshes = updatedIds => {
  const currentRefreshes = new Map
  for (let id of updatedIds.keys())
    deferItemRefreshes(id, currentRefreshes)
}

const deferItemRefreshes = (normId, currentRefreshes) => {
  if (currentRefreshes.has(normId)) return
  g.refreshes.set(normId, true)
  currentRefreshes.set(normId, true)

  const itemParents = g.parents.get(normId)
  if (!itemParents) return
  for (let parentNormId of itemParents.keys())
    deferItemRefreshes(parentNormId, currentRefreshes)
}

export const applyLoops = (updatedIds, loops) => {
  for (let id of loops.keys()) {
    const itemLoops = loops.get(id)
    for (let loop of itemLoops) {
      const itemIndex = loop.findIndex(key => key === id)
      let currentLevel = g.items.get(id)
      let i = itemIndex + 1

      while (i < loop.length) {
        const key = loop[i++]
        const nextKey = loop[i]
        if (updatedIds.has(nextKey)) {
          const childItem = g.items.get(nextKey)
          currentLevel[key] = childItem
          currentLevel = childItem
          ++i
        } 
        else currentLevel = currentLevel[key]
      }
    }
  }
}

// dev utils
export const cloneMap = map => {
  if (!map) return null
  const r = {}
  let i = 0
  for (let [key, val] of map.entries()) {
    if (isPlainObject(key) || Array.isArray(key)) key = `obj ${i++}`
    r[key] = val
  }
  return r
}

export const cloneMapIds = map => {
  if (!map) return null
  const r = []
  for (let id of map.keys())
    r.push(g.items.get(id))
  return r
}

export * from './path'
export * from './normalizeId'
export * from './relations'
export * from './notifier'
