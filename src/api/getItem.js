import g from '*/global'
import {
  normalizeId,
  extractId,
  isOrm,
  isPlainObject
} from '*/utils'

const getItem = normId => g.items[normId]

export default getItem
