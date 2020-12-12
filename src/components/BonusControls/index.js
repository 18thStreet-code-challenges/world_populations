import React from 'react'
import { Slider } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Util from 'lib/Util'
import PopInfo from 'components/PopInfo'
import con from 'lib/consts.js'
import './bonusControls.css'

const BonusControls = ({
// eslint-disable-next-line react/prop-types
  minPop, maxPop, minPopCutoff, maxPopCutoff, birdsEye,
  // eslint-disable-next-line react/prop-types
  setMinPopCutoff, setMaxPopCutoff, setBirdsEye, setBarHeight,
  // eslint-disable-next-line react/prop-types
  entity, setEntity, ordering, setOrdering
}) => {
  const sliderStyles = makeStyles({
    root: {
      width: con.SLIDER_WIDTH
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
          </div>
          <div className='filter birdseye'>
            <label>Bird's Eye View:</label> <input
              type='checkbox' checked={birdsEye} onChange={(e) => {
                const checked = e.target.checked
                setBirdsEye(checked)
                setBarHeight(checked ? con.SKINNY_BARS : con.WIDE_BARS)
              }} />
            <PopInfo>
              Turning on Bird's Eye View makes the Bar Chart
              <br />small enough to see in a single screen.
            </PopInfo>

          </div>
          <div className='filter entities'>
            <label>Entities:</label>
            <input
              type='radio' value='entity'
              checked={entity === con.entity.DEFAULT_COUNTRIES}
              onChange={() => setEntity(con.entity.DEFAULT_COUNTRIES)} />
            <label>Countries</label>
            <input
              type='radio' value='entity'
              checked={entity === con.entity.REGIONS}
              onChange={() => setEntity(con.entity.REGIONS)} />
            <label>Regions</label>
            <input
              type='radio' value='entity'
              checked={entity === con.entity.BOTH}
              onChange={() => setEntity(con.entity.BOTH)} />
            <label>Both</label>
            <PopInfo>
              The source data is a mix of Country data, and aggregates
              <br />by region or economy (for example, "Upper Middle Income"
              <br />and "Arab World").  This control lets you include or
              <br />exclude either.
            </PopInfo>
          </div>
          <div className='filter ordering'>
            <label>Order:</label>
            <input
              type='radio' value='ordering'
              checked={ordering === con.ordering.NAME}
              onChange={() => setOrdering(con.ordering.NAME)} />
            <label>By Country Name</label>
            <input
              type='radio' value='ordering'
              checked={ordering === con.ordering.DEFAULT_SIZE}
              onChange={() => setOrdering(con.ordering.DEFAULT_SIZE)} />
            <label>By Population Size</label>
            <PopInfo>
              Order by size for a cleaner looking display, order by name to
              <br />look for countries.
            </PopInfo>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BonusControls
