import g from '*/global'

export let all = orm =>
  Object.keys(g.ids[orm.name]).map(orm.get)
