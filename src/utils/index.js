import g from '*/global'
import { theEnd } from './relations'

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

export const applyLoops = updates => {
  for (let normId of updates.keys()) {
    const item = g.items[normId]
    const graphParents = g.graph[normId]
    if (!graphParents) continue

    for (let parentNormId of updates.get(normId).keys()) {
      const graphLevel = graphParents[parentNormId]
      if (!graphLevel) continue
      for (let key in graphLevel) 
        applyLoopToTheEnd(g.items[normId], g.items[parentNormId], graphLevel, key)
    }
  }
}

const applyLoopToTheEnd = (item, parentLevel, graphLevel, key) => {
  for (let key in graphLevel) {
    if (graphLevel[key] === theEnd) parentLevel[key] = item
    else applyLoopToTheEnd(item, parentLevel, graphLevel, key)
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
