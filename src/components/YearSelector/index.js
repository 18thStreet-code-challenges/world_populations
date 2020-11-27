import React from 'react'
import './yearSelector.css'

const MINIMUM_YEAR = 1960
const MAXIMUM_YEAR = 2016
const NUMBER_OF_YEARS = (MAXIMUM_YEAR - MINIMUM_YEAR) + 1

// eslint-disable-next-line react/prop-types
const YearSelector = ({ stateHandler }) => {
  const yearList = Array.from(Array(NUMBER_OF_YEARS).keys()).sort((a, b) => {
    if (a > b) return -1
    if (b > a) return 1
    return 0
  })

  return (
    <select
      defaultValue={MAXIMUM_YEAR}
      onChange={(e) => {
        stateHandler(e.target.value)
      }}>
      {
        yearList.map((idx) => {
          const label = MINIMUM_YEAR + idx + ''
          return <option value={idx} key={`years${idx}`}>{label}</option>
        })
      }
    </select>
  )
}
export default YearSelector
