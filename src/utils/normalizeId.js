import { pathGet, pathSet } from '*/utils'

const normIds = {} // { categoryid: normId }

export const normalizeId = (category, id) => {
  const key = category + id
  let normId = normIds[key] || (normIds[key] = key/* Symbol(key) */)
  return normId
}
