import g from '*/global'
import { waySet, wayGet } from './way'
export * from './way'
export * from './notifier'

export const normalizeId = (orm, id) => {
  const ids = wayGet(g.ids, orm.name) || waySet(g.ids, orm.name)({})
  if (id && !ids.hasOwnProperty(id))
    waySet(ids, id)(
      /* Symbol( */`${orm.name}-${id}`/* ) */
    )
  return ids[id]
}
export const extractId = inst => isPlainObject(inst) && inst.id
export const isOrm = inst => inst && g.descFuncs[inst.name]
export const isPlainObject = inst => inst && Object.getPrototypeOf(inst) === Object.prototype
export const isPromise = inst => inst && typeof inst.then === 'function'

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

export const enhance = (enhancers, inst) =>
  enhancers.reduce(
    (prevInst, enhancer) => enhancer(prevInst),
    inst
  )

const z = console.log
window.z = true
console.log = (...args) => {
  z(...args)
  window.z = window.z && !args.some(t=>!t)
}
