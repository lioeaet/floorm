import g from '*/global'
import { notify } from '*/utils'

const replaceItem = (normId, item) => {
  g.items[normId] = item

  const updatedIds = new Map().set(normId, true)
  notify(updatedIds)
  return item
}

export default replaceItem
