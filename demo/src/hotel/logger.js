import { orm/* , door, stone */ } from 'floorm'

let ormName, itemId, parents

orm.enhance(orm => {
  const { name, put/* , replace, remove */ } = orm

  let prevItem

  orm.put = diff => {
    ormName = name
    itemId = diff.id
    prevItem = orm.get(itemId)

    const nextItem = put(diff)

    console.log('put', { prevItem, diff, nextItem, parents })

    return nextItem
  }

  orm.listen((item, prevItem) => {
    if (orm.name === ormName && item.id === itemId) return
    if (!parents[name]) parents[name] = {}

    parents[name][item.id] = { prev: prevItem, next: item }
  })

  return orm
})

// door.enhance(door => {
//   
// })
