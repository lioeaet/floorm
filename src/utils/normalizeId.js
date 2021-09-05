import { pathGet, pathSet } from '*/utils'

const normIds = {} // { category: { id: normId } }

/*
 any element of system has normId for fast access 
*/

export const normalizeId = (category, id) => {
  const key = category + '-' + id
  let normId = normIds[key] || (normIds[key] = key/* Symbol(key) */)
  return normId
}
