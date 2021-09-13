import g from '*/global'

// todo new Map
export const isOrm = inst => inst && g.descFuncs[inst.name]

const plainObjProto = Object.getPrototypeOf({})
export const isPlainObject = inst => inst && Object.getPrototypeOf(inst) === plainObjProto

export const isPromise = inst => inst && typeof inst.then === 'function'

export const extractId = (...itemModes) => {
  const itemWithId = itemModes.find(obj =>
    isPlainObject(obj) &&
    obj.hasOwnProperty('id')
  )
  if (itemWithId) return itemWithId.id
}

// dev utils
export const clone = (inst, clones = new Map) => {
  if (clones.has(inst)) return clones.get(inst)

  if (isPlainObject(inst)) {
    let x = {}
    clones.set(inst, x)
    for (let key in inst) x[key] = clone(inst[key], clones)
    return x
  }
  if (Array.isArray(inst)) {
    let x = []
    clones.set(inst, x)
    for (let i = 0; i < inst.length; i++) x[i] = clone(inst[i], clones)
    return x
  }
  if (inst && Object.getPrototypeOf(inst) === Map.prototype) {
    let x = new Map
    clones.set(inst, x)
    for (let [key, val] of inst) x.set(key, clone(val, clones))
    return x
  }
  return inst
}

export * from './path'
export * from './normalizeId'
export * from './relations'
export * from './notifier'
