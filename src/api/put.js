import g from '*/global'
import {
  notify,
} from '*/utils'
import { updateParents } from '*/utils/parents'
import { mergeItem } from '*/utils/merge'

export const put = (orm, normId, diff) => {
  mergeItem(orm, normId, diff)

  g.isUpdateParents = true
  updateParents()

  g.isUpdateParents = false
  g.nextItems = {}
  g.currentGraph = {}
  g.iterationUpdates = {}
  notify(g.nextItems)

  return g.items[normId]
}
