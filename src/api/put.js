import g from '*/global'
import { notify } from '*/utils'
import { updateParents } from '*/cellar/parents'
import { mergeItem } from '*/cellar/merge'

export const put = (orm, normId, diff) => {
  mergeItem(orm, normId, diff)
  updateParents()
  notify(g.nextItems)

  g.isUpdateParents = false
  g.nextItems = {}
  g.currentGraph = {}
  g.iterationUpdates = {}
  g.prevItems = {}

  return g.items[normId]
}
