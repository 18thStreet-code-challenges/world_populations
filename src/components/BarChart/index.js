import React, { Fragment } from 'react'
import ReactTooltip from 'react-tooltip'
import Util from 'lib/Util'
import './barChart.css'

const BAR_COLORS = [{ bg: '#003f5c', fg: 'white' }, { bg: '#bc5090', fg: 'white' }, { bg: '#ffa600', fg: 'black' }]
const HORIZONTAL_CHAR_WIDTH = 8

// eslint-disable-next-line react/prop-types
const BarChart = ({ filteredData, windowWidth, newMax, skinnyBars, barHeight }) => {
  return (
    <Fragment>
      {
        // eslint-disable-next-line react/prop-types
        filteredData.map((item, i) => {
          // console.log(`(${item.value}/${max}) * ${this.state.windowWidth} = ${(item.value / max) * this.state.windowWidth}`)
          const size = item.value
          const barWidth = (size / newMax) * windowWidth
          const style = {
            width: barWidth,
            height: barHeight + 'px',
            backgroundColor: BAR_COLORS[i % 3].bg,
            color: BAR_COLORS[i % 3].fg
          }
          const text = `${item.Country_Code} - ${item.Country} - ${Util.millionize(size)} mil`
          const textPixels = text.length * HORIZONTAL_CHAR_WIDTH
          let bar
          switch (true) {
          case skinnyBars:
            bar = (
              <div key={'c' + i}>
                <div className='bar' style={style} alt={text} data-tip data-for={`bar${i}`} />
                <ReactTooltip id={`bar${i}`} place='bottom' type='dark' effect='solid'>
                  <span>{text}</span>
                </ReactTooltip>
              </div>
            )
            break
          case barWidth > textPixels:
            bar = (
              <div
                className='bar' style={style} key={'c' + i} title={text}>
                <div className='name-internal'>{text}</div>
              </div>
            )
            break
          case barWidth <= textPixels:
          default:
            bar = (
              <div key={'c' + i}>
                <div
                  className='bar shortbar' style={style} title={text} />
                <div className='name-external'>{text}</div>
              </div>
            )
          }
          return bar
        })
      }
    </Fragment>
  )
}

export default BarChart
