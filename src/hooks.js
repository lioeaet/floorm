import g from '*/global'
import { useState, useEffect } from 'react'
import { STONE_ID } from '*/factories/stone'
import { normalizeId, isPromise } from '*/utils'
import { getPromise, watchItemWithPromise } from '*/cellar/promises'

export const useStone = stone => {
  const normId = normalizeId(g.orms[stone.name], STONE_ID)
  const [state, setState] = useState(getState(normId))

  useWatcher(stone.normId, setState)
  if (isPromise(state)) throw state.then(diff => diff)
  return state && state.state
}

export const useDoor = (door, id) => {
  const normId = normalizeId(g.orms[door.name], id)
  const [state, setState] = useState(getState(normId))

  useWatcher(normId, setState)
  if (isPromise(state)) throw state
  return state
}

const useWatcher = (normId, setState) => {
  const renderState = getState(normId)
  useEffect(
    () => {
      const watcher = () => setState(getState(normId))

      if (renderState !== getState(normId)) watcher()
      return watchItemWithPromise(normId, watcher)
    },
    [normId, renderState, setState]
  )
}

const getState = normId => getPromise(normId) || g.items[normId]
