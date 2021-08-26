import g from '*/global'

export const isOrm = inst => isPlainObject(inst) && g.descriptions.has(inst.normId)

export const isPlainObject = inst =>
  inst && Object.getPrototypeOf(inst) === Object.getPrototypeOf({})

export const resolveDiff = (diff, level) =>
  typeof diff === 'function' ? diff(level) : diff

export const isPromise = inst => inst && typeof inst.then === 'function'

export const isFunction = inst => typeof inst === 'function'

// добавляем сюда stack и суём его в id массивов
// массив в определённом месте не орм, поэтому всегда считается одним
export const extractId = (...itemModes) => {
  const itemWithId = itemModes.find(obj =>
    isPlainObject(obj) &&
    obj.hasOwnProperty('id')
  )
  if (itemWithId) return itemWithId.id
}

export const applyLoops = (updatedIds, loops) => {
  for (let id of loops.keys()) {
    const itemLoops = loops.get(id)
    for (let loop of itemLoops) {
      const itemIndex = loop.findIndex(key => key === id)
      let currentLevel = g.items[id]
      let i = itemIndex + 1

      while (i < loop.length) {
        const key = loop[i++]
        const nextKey = loop[i]
        if (updatedIds.has(nextKey)) {
          const childItem = g.items[nextKey]
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
    r.push(g.items[id])
  return r
}

export * from './path'
export * from './normalizeId'
export * from './relations'
export * from './notifier'
