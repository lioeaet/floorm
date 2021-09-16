import g from '*/global'
import { notify } from '*/utils'
import { updateParents } from '*/utils/parents'
import { mergeItem } from '*/utils/merge'

export const put = (orm, normId, diff) => {
  mergeItem(orm, normId, diff)
  updateParents()
  notify(g.nextItems)

  g.isUpdateParents = false
  g.nextItems = {}
  g.currentGraph = {}
  g.iterationUpdates = {}

  return g.items[normId]
}
