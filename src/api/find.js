import g from '*/global'

export let find = (orm, cb = k=>k) => {
  let ormIds = g.ids[orm.name]
  for (let id in ormIds) {
    let k = cb(g.items[ormIds[id]])
    if (k) return k
  }
}
