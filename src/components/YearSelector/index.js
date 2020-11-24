import React from 'react'
import './yearSelector.css'

const MINIMUM_YEAR = 1960
const MAXIMUM_YEAR = 2016
const NUMBER_OF_YEARS = (MAXIMUM_YEAR - MINIMUM_YEAR) + 1

// eslint-disable-next-line react/prop-types
const YearSelector = ({ stateHandler }) => {
  return (
    <select
      defaultValue={MAXIMUM_YEAR}
      onChange={(e) => {
        stateHandler(e.target.value)
      }}>
      {
        Array.from(Array(NUMBER_OF_YEARS).keys()).map((idx) => {
          const label = MINIMUM_YEAR + idx + ''
          return <option value={idx} key={`years${idx}`}>{label}</option>
        })
      }
    </select>

  )
}
export default YearSelector
