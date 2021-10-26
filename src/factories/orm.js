import g from '*/global'
import { enhance } from '*/utils'

export const orm = (name, desc = () => ({})) => {
  if (!name) throw 'orm name is required'
  if (g.descFuncs[name]) throw `duplicate orm name ${name}`

  g.descFuncs[name] = desc

  return g.orms[name] = enhance(enhancers, { name })
}
const enhancers = []
orm.enhance = enhancer => enhancers.push(enhancer)
