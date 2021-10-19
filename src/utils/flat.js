import g from '*/global'
import { normalizeId, isOrm, isPlainObject } from '*/utils'
import { get } from '*/api/get'
import { STONE_ID } from '*/factories/stone'

export const flat = (doorOrStone, id) => {
  const isDoor = doorOrStone.hasOwnProperty('all')
  const desc = g.descFuncs[doorOrStone.name]()
  const item = get(normalizeId({ name: doorOrStone.name }, isDoor ? id : STONE_ID))

  const flatItem = cloneFlat(desc, item)

  return isDoor ? flatItem : flatItem.state
}

const cloneFlat = (desc, level) => {
  if (isOrm(desc)) return level && level.id

  if (Array.isArray(desc))
    return level.map(item => item && item.id)

  if (isPlainObject(desc)) {
    if (!level) return level

    let result = {}
    for (let key in level)
      result[key] = cloneFlat(desc[key], level[key])

    return result
  }

  return level
}
