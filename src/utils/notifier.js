import g from '*/global'
import { normalizeId } from '*/utils'

const itemWatchers = {}
const ormWatchers = {}

export const watch = (orm, watcher) => {
  const watchers = ormWatchers[orm.name] || (ormWatchers[orm.name] = [])
  watchers.push(watcher)
  return () => watchers.splice(watchers.indexOf(watcher), 1)
}

export const watchId = (orm, id, watcher) => {
  const normId = normalizeId(orm, id)
  const watchers = itemWatchers[normId] || (itemWatchers[normId] = [])
  watchers.push(watcher)
  return () => watchers.splice(watchers.indexOf(watcher), 1)
}

export const notify = nextItems => {
  for (let normId in nextItems)
    notifyItem(normId)
}

export const notifyItem = normId => {
  const item = g.items[normId]
  const orm = g.orms[normId]
  const prevItem = g.prevItems[normId]

  // item just removed from parent with graph changes
  if (item === prevItem) return

  const itemWatchersArr = itemWatchers[normId] || []
  const ormWatchersArr = ormWatchers[orm.name] || []

  for (let watcher of itemWatchersArr) watcher(item, prevItem)
  for (let watcher of ormWatchersArr) watcher(item, prevItem, normId)
}
