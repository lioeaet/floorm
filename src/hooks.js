import g from '*/global'
import { useState, useEffect } from 'react'
import { STONE_ID } from '*/factories/stone'
import { normalizeId, isPromise } from '*/utils'
import { getPromise, listenItemWithPromise } from '*/cellar/promises'

export const useStone = stone => {
  const normId = normalizeId(g.orms[stone.name], STONE_ID)
  const [state, setState] = useState(getState(normId))
  useListener(stone.normId, setState, state)
  if (isPromise(state)) throw state
  return state && state.state
}

export const useDoor = (door, id) => {
  const normId = normalizeId(g.orms[door.name], id)
  const [state, setState] = useState(getState(normId))
  useListener(normId, setState, state)
  if (isPromise(state)) throw state
  return state
}

export const useDoors = (door, ids) => {
  const normIds = ids.map(id => normalizeId(g.orms[door.name], id))
  const [state, setState] = useState(normIds.map(getState))
  useListeners(normIds, setState, state)
  state.forEach(k => {
    if (isPromise(k)) throw k
    else return false
  })
  return state
}

const useListener = (normId, setState, iSt) => {
  useEffect(
    () => {
      const listener = () => setState(getState(normId))

      if (iSt !== getState(normId)) listener()
      return listenItemWithPromise(normId, listener)
    },
    [normId, iSt, setState]
  )
}

const useListeners = (normIds, setState, iSt) => {
  useEffect(
    () => {
      for (let i = 0; i < normIds.length; i++) {
        const normId = normIds[i]
        const listener = () => setState(getState(normId))

        if (iSt[i] !== getState(normId)) listener()
        return listenItemWithPromise(normId, listener)
      }
    },
    [normIds, iSt, setState]
  )
}

const getState = normId => getPromise(normId) || g.items[normId]
