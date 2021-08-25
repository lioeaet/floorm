import g from '*/global'
import { normalizeId } from '*/utils'

const ormFactory = desc => {
  const normId = normalizeId('orm', desc)
  g.descriptions.set(normId, desc)

  return normId
}

export default ormFactory
