import React, { Fragment } from 'react'
import './popSlider.css'
const SLIDER_DELAY = 250
const SLIDER_WIDTH = 300
function debounce (fn, ms) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}
// eslint-disable-next-line react/prop-types
const PopSlider = ({ label, min, max, cutoff, id, handler }) => {
  return (
    <Fragment>
      <label>{label}</label> <input
        type='range'
        id={id} min={min} max={max}
        defaultValue={cutoff}
        step={1}
        style={{ width: `${SLIDER_WIDTH}px` }}
        onChange={debounce(handler, SLIDER_DELAY)} />
    </Fragment>
  )
}
export default PopSlider
