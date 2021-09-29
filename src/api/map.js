import g from '*/global'

export let o = Symbol('o')

export let map = (orm, cb = k=>k) =>
  Object.keys(g.ids[orm.name])
    .map(id => cb(orm.get(id)))
