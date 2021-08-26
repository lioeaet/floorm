import { useState, useEffect } from 'react'
import g from '*/global'
import { getItem } from '*/api/getItem'
import { normalizeId, isPromise, listen } from '*/utils'
import { LOADING_NORM_ID } from '*/loading'

export const useStone = stone => {
  const [state, setState] = useState(getState(stone.normId))

  useListener(stone.normId, setState)
  if (isPromise(state)) throw state
  return state
}

export const useStore = (store, id) => {
  const orm = g.ormsByNormId.get(store.normId)
  const normId = normalizeId(orm, id)
  const [state, setState] = useState(getState(normId))

  useListener(normId, setState)
  if (isPromise(state)) throw state
  return state
}

export const useLoading = () => {
  const [loading, setLoading] = useState(false)
  useListener(
    LOADING_NORM_ID,
    nextLoading => nextLoading !== loading && setLoading(nextLoading)
  )
  return loading
}

const useListener = (normId, setState) => {
  const initState = getState(normId)
  useEffect(
    () => {
      const listener = () => {
        if (normId === 9) console.log(getState(normId))
        setState(getState(normId))
      }
      if (initState !== getState(normId)) listener()
      return listen(normId, listener)
    },
    [normId, initState, setState]
  )
}

const getState = normId => g.suspensePromises.get(normId) || getItem(normId)
