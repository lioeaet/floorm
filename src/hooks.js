import g from '*/global'
import { useState, useEffect } from 'react'
import { STONE_ID } from '*/factories/stone'
import { normalizeId, isPromise } from '*/utils'
import { getPromise, watchIdWithPromise } from '*/cellar/promises'

export const useStone = stone => {
  const orm = g.orms[stone.name]
  const normId = normalizeId(orm, STONE_ID)
  const [state, setState] = useState(getState(normId))

  useWatcher(orm, STONE_ID, setState)
  if (isPromise(state)) throw state.then(diff => diff)
  return state && state.state
}

export const useDoor = (door, id) => {
  const orm = g.orms[door.name]
  const normId = normalizeId(orm, id)
  const [state, setState] = useState(getState(normId))

  useWatcher(orm, id, setState)
  if (isPromise(state)) throw state
  return state
}

const useWatcher = (orm, id, setState) => {
  const normId = normalizeId(orm, id)
  const renderState = getState(normId)
  useEffect(
    () => {
      const watcher = () => setState(getState(normId))

      if (renderState !== getState(normId)) watcher()
      return watchIdWithPromise(orm, id, watcher)
    },
    [orm, id, normId, renderState, setState]
  )
}

const getState = normId => getPromise(normId) || g.items[normId]
