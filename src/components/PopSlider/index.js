import React, { Fragment } from 'react'
import Util from 'lib/Util'
import './popSlider.css'
const SLIDER_DELAY = 250
const SLIDER_WIDTH = 400
const debounce = Util.debounceFactory()

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
