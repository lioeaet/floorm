import g from '*/global'
import { useState, useEffect } from 'react'
import { STONE_ID } from '*/factories/stone'
import { normalizeId, isPromise } from '*/utils'
import { getPromise, listenItemWithPromise } from '*/cellar/promises'

export const useStone = stone => {
  const normId = normalizeId(g.orms[stone.name], STONE_ID)
  const [state, setState] = useState(getState(normId))

  useListener(stone.normId, setState)
  if (isPromise(state)) throw state.then(diff => diff)
  return state && state.state
}

export const useDoor = (door, id) => {
  const normId = normalizeId(g.orms[door.name], id)
  const [state, setState] = useState(getState(normId))

  useListener(normId, setState)
  if (isPromise(state)) throw state
  return state
}

const useListener = (normId, setState) => {
  const renderState = getState(normId)
  useEffect(
    () => {
      const listener = () => setState(getState(normId))

      if (renderState !== getState(normId)) listener()
      return listenItemWithPromise(normId, listener)
    },
    [normId, renderState, setState]
  )
}

const getState = normId => getPromise(normId) || g.items[normId]
