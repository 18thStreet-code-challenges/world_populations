import React, { Fragment } from 'react'
import Bar from 'components/Bar'
import './barChart.css'

// eslint-disable-next-line react/prop-types
const BarChart = ({ filteredData, windowWidth, newMax, skinnyBars, barHeight }) => {
  return (
    <Fragment>
      {
        // eslint-disable-next-line react/prop-types
        filteredData.map((population, i) => {
          // console.log(`(${item.value}/${max}) * ${this.state.windowWidth} = ${(item.value / max) * this.state.windowWidth}`)
          return <Bar population={population} idx={i} key={`bar${i}`} newMax={newMax} windowWidth={windowWidth} barHeight={barHeight} skinnyBars={skinnyBars} />
        })
      }
    </Fragment>
  )
}

export default BarChart
