import { useState, useEffect } from 'react'
import g from '*/global'
import { normalizeId, isPromise } from '*/utils'
import { getPromise, listenItemWithPromise } from '*/react/promises'

export const useStone = stone => {
  const [state, setState] = useState(getState(stone.normId))

  useListener(stone.normId, setState)
  if (isPromise(state)) throw state
  return state && state.state
}

export const useDoor = (door, id) => {
  const normId = normalizeId(door.orm, id)
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
