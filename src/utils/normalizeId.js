import { pathGet, pathSet } from '*/utils'

const normIds = new Map // { category: { id: normId } }

/*
 orm
 store
 stone
 loader
 item
 any element of system has normId for fast access 
*/
let lastNormId = 0
export const normalizeId = (category, id) => {
  const normId = pathGet(normIds, category, id) || String(++lastNormId)
  pathSet(normIds, category, id)(normId)

  return normId
}
