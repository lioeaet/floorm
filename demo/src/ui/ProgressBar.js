import React, { useRef, useLayoutEffect } from 'react'
import { useLocationPending } from 'react-router'
import { useLoading } from '*'
import { usePrev } from '../utils'

let intervalId
let startTimerId

const START_DELAY = 300
const START_DURATION = 0
const STEP_DURATION = 400
const END_DELAY = 250
const END_DURATION = 250

const ProgressBar = () => {
  const isLocationPending = useLocationPending()
  const loading = useLoading() || isLocationPending
  const prevLoading = usePrev(loading)

  const containerRef = useRef()
  const loaderRef = useRef()

  useLayoutEffect(() => {
    if (loading === prevLoading) return () => {}

    const container = containerRef.current
    const loader = loaderRef.current

    if (loading && !prevLoading) {
      container.style.transition = `opacity ${START_DURATION}ms linear ${START_DELAY}ms`
      container.style.opacity = 1

      startTimerId = setTimeout(() => {
        loader.style.width = '15%'

        intervalId = setInterval(() => {
          const diff = Math.round(Math.random() * 10) + 4

          loader.style.width = parseInt(loader.style.width) + diff + '%'
        }, STEP_DURATION)
      }, START_DELAY)
    }

    if (!loading && prevLoading) {
      clearInterval(intervalId)
      clearTimeout(startTimerId)

      container.style.transition = `opacity ${END_DURATION}ms linear ${END_DELAY}ms`
      container.style.opacity = 0
      loader.style.width = `100%`

      setTimeout(() => {
        loader.style.width = 0
      }, END_DELAY + END_DURATION)
    }
  }, [loading, prevLoading])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        opacity: 0
      }}
    >
      <div
        ref={loaderRef}
        style={{
          width: 0,
          height: 2,
          backgroundColor: 'rgba(70, 214, 178, 1)',
          transition: `width ${STEP_DURATION}ms ease`
        }}
      />
    </div>
  )
}

export default ProgressBar
