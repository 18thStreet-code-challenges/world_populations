import React from 'react'
import { Slider } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Util from '../../lib/Util'
import PopInfo from 'components/PopInfo'
import './bonusControls.css'

const WIDE_BARS = 20
const SKINNY_BARS = 1
const SLIDER_WIDTH = 750

const BonusControls = ({
// eslint-disable-next-line react/prop-types
  minPop, maxPop, minPopCutoff, maxPopCutoff, birdsEye,
  // eslint-disable-next-line react/prop-types
  setMinPopCutoff, setMaxPopCutoff, setBirdsEye, setBarHeight
}) => {
  const sliderStyles = makeStyles({
    root: {
      width: SLIDER_WIDTH
    }
  })
  const sliderClasses = sliderStyles()
  const ValueLabelComponent = (props) => {
    // eslint-disable-next-line react/prop-types
    const { children, open, value } = props

    return (
      <Tooltip open={open} enterTouchDelay={0} placement='top' title={value}>
        {children}
      </Tooltip>
    )
  }

  return (
    <div className='accordion'>
      <div className='card'>
        <div className='card-header' id='headingOne' data-toggle='collapse' data-target='#collapseOne'>
          <h2 className='mb-0'>
            <button
              className='btn btn-link' type='button' data-toggle='collapse' data-target='#collapseOne'
              aria-expanded='true' aria-controls='collapseOne'>
              Bonus Controls
            </button>
          </h2>
        </div>

        <div id='collapseOne' className='collapse hide bonus-controls' aria-labelledby='headingOne'>
          <div className='card-body'>
            <div style={{ display: 'inline-block' }}>
              <div className={sliderClasses.root}>
                <Typography id='range-slider' gutterBottom>
                  Population Range (in mil)
                  <PopInfo>
                    The Population Range slider allows you include/exclude population ranges,
                    <br />causing the display to give greater space to countries in that range.
                    <br />
                    <br />It is a dual slider, with grab points for the maximum and the minimum.
                    <br />
                    <br />Example: try bringing the maximum closer to the minimum.
                  </PopInfo>
                </Typography>
                <Slider
                  min={minPop}
                  max={maxPop}
                  value={[minPopCutoff, maxPopCutoff]}
                  onChange={(e, newValue) => {
                    setMinPopCutoff(newValue[0])
                    setMaxPopCutoff(newValue[1])
                  }}
                  ValueLabelComponent={ValueLabelComponent}
                  valueLabelFormat={x => {
                    return <span>{Util.millionize(x)}</span>
                  }}
                  dual={true}
                  aria-labelledby='range-slider'
                  getAriaValueText={v => v}
                  ThumbComponent='span'
                />
              </div>
            </div>
            <div className='slider-right-label'>
              <Tooltip title={`${Util.numberWithCommas(minPopCutoff)} to ${Util.numberWithCommas(maxPopCutoff)}`}>
                <span>{`${Util.millionize(minPopCutoff)} to ${Util.millionize(maxPopCutoff)}`} mil</span>
              </Tooltip>
            </div>
            <br />
            <label>Bird's Eye View:</label> <input
              type='checkbox' checked={birdsEye} onChange={(e) => {
                const checked = e.target.checked
                setBirdsEye(checked)
                setBarHeight(checked ? SKINNY_BARS : WIDE_BARS)
              }} />
            <PopInfo>
              Turning on Bird's Eye View makes the Bar Chart small enough to see in a single screen.
            </PopInfo>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BonusControls
