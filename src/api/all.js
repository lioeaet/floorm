import g from '*/global'
import { get } from '*/api/get'
import { normalizeId } from '*/utils'

export let all = orm =>
  Object.keys(g.ids[orm.name]).map(id => get(normalizeId(orm, id)))
