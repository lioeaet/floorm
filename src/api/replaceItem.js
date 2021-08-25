import g from '*/global'
import { notify, deferRefreshes } from '*/utils'

const replaceItem = (normId, item) => {
  g.items.set(normId, item)
  g.currentUpdatedAt = Date.now()
  g.updatedAt.set(normId, g.currentUpdatedAt)

  const updatedIds = new Map().set(normId, true)
  deferRefreshes(updatedIds)
  notify(updatedIds)
  return item
}

export default replaceItem
