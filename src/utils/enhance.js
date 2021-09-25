import { orm, door, stone } from 'floorm'

const items = {}

let ormName, prevItem, diff, nextItem, parents

orm.enhance(orm => {
  const { name, put, replace } = orm
  items[name] = {}

  let prevItem
  const parents = {}

  orm.put = diff => {
    ormName = name
    prevItem = items[name] && items[name][diff.id]
    nextItem = put(diff)

    console.log('put', { prevItem, diff, nextItem, parents })

    return nextItem
  }

  orm.listen(item => {
    if (orm.name === ormName && item.id === diff.id) return
    if (!parents[name]) parents[name] = {}

    parents[name][item.id] = { prev: items[orm.name][item.id], next: item }
    items[name][item.id] = item
  })

  return orm
})

enchancer {
  init: name,
  putMiddleware: (diff, next) => {},
  getMiddleware: (id) => {}
}

const ormEnhanced = (descFunc, name) => {
  const ormInst = orm(descFunc, name)
  const defaultPut = ormInst.put
  items[name] = {}

  ormInst.put = diff => {
    const item = defaultPut(diff)
    items[name][diff.id] = item
  }

  const defaultListen = ormInst.listen
  ormInst.listen = item => {
    items
  }

  return ormInst
}
