import g from '*/global'

const z = console.log
window.z = true
console.log = (...args) => {
  z(...args)
  window.z = window.z && args.every(t=>t)
}

export const normalizeId = (orm, id) => `floormNormId-${orm.name}-${id}`

export const isOrm = inst => inst && g.descFuncs[inst.name]

export const isPlainObject = inst => inst && Object.getPrototypeOf(inst) === Object.prototype

export const extractId = inst => isPlainObject(inst) && inst.id

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
export * from './way'
export * from './relations'
export * from './notifier'
