import g from '*/global'

export const orm = (name, desc = () => ({})) => {
  if (!name) throw 'orm name is required'
  if (g.descFuncs[name]) throw `duplicate orm name ${name}`

  g.descFuncs[name] = desc

  return g.orms[name] = { name }
}
