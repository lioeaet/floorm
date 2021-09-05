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

export const cloneDeep = (inst, updates = new Map) => {
  if (updates.has(inst)) return updates.get(inst)

  if (isPlainObject(inst)) {
    let clone = {}
    updates.set(inst, clone)
    for (let key in inst) {
      clone[key] = cloneDeep(inst[key], updates)
    }
    return clone
  }
  if (Array.isArray(inst)) {
    let clone = []
    updates.set(inst, clone)
    for (let i = 0; i < inst.length; i++) {
      clone[i] = cloneDeep(inst[i], updates)
    }
    return clone
  }
  return inst
}

export * from './path'
export * from './normalizeId'
export * from './relations'
export * from './notifier'
