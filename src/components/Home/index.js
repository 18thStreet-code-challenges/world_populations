import React, { useEffect, useLayoutEffect, useState } from 'react'
import CountryDAO from 'lib/CountryDAO'
import YearSelector from 'components/YearSelector'
import BonusControls from 'components/BonusControls'
import BarChart from 'components/BarChart'
import PopInfo from 'components/PopInfo'
import './home.css'

const CHART_MARGIN = 27
const WIDE_BARS = 20
const dao = new CountryDAO()

const Home = () => {
  const [hasData, setHasData] = useState(false)
  const [yearIdx, setYearIdx] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [barHeight, setBarHeight] = useState(WIDE_BARS)
  const [birdsEye, setBirdsEye] = useState(false)
  const [minPop, setMinPop] = useState(0)
  const [maxPop, setMaxPop] = useState(0)
  const [minPopCutoff, setMinPopCutoff] = useState(0)
  const [maxPopCutoff, setMaxPopCutoff] = useState(0)
  useEffect(() => {
    getData()
      .then(success => {
        setHasData(dao.hasData())
        setMinPopCutoff(dao.getData()[yearIdx].meta.min)
        setMaxPopCutoff(dao.getData()[yearIdx].meta.max)
      })
      .catch(e => console.log(e))

    window.addEventListener('resize', handleWindowResize)
    setWindowWidth(window.innerWidth - CHART_MARGIN)
  }, []) // Call once only

  useLayoutEffect(() => { // useLayoutEffect triggers render when done
    if (hasData) {
      setMaxPop(dao.getData()[yearIdx].meta.max)
      setMinPop(dao.getData()[yearIdx].meta.min)
      setMinPopCutoff(dao.getData()[yearIdx].meta.min)
      setMaxPopCutoff(dao.getData()[yearIdx].meta.max)
      setBirdsEye(false)
      setBarHeight(WIDE_BARS)
    }
  }, [hasData, yearIdx])

  const getData = async () => {
    const json = await dao.retrieve()
    dao.validate(json)
    dao.adapt(json)
    return true
  }

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth - CHART_MARGIN)
  }

  const filterDataByPopRanges = () => {
    return dao.getData()[yearIdx].pop.filter((item, i) => {
      const size = item.value
      return (size >= minPopCutoff) && (size <= maxPopCutoff)
    })
  }
  const getNewMax = (filteredData) => {
    return filteredData.reduce((newMax, item) => {
      if (item.value > newMax) {
        newMax = item.value
      }
      return newMax
    }, Number.MIN_SAFE_INTEGER)
  }
  if (hasData) {
    const filteredData = filterDataByPopRanges()
    const newMax = getNewMax(filteredData)
    return (
      <div className='chart-container'>
        <div className='year-select'>
          <label>Census Year:</label> <YearSelector stateHandler={setYearIdx} />
          <PopInfo>Note: Year selection resets bonus controls to their defaults.</PopInfo>
        </div>
        <BonusControls
          minPop={minPop} maxPop={maxPop} minPopCutoff={minPopCutoff}
          maxPopCutoff={maxPopCutoff} birdsEye={birdsEye} setMinPopCutoff={setMinPopCutoff}
          setMaxPopCutoff={setMaxPopCutoff} setBirdsEye={setBirdsEye}
          setBarHeight={setBarHeight} />
        <div className='card'>
          <div className='card-body'>
            <BarChart
              filteredData={filteredData} windowWidth={windowWidth} newMax={newMax}
              birdsEye={birdsEye} barHeight={barHeight} />
          </div>
        </div>
      </div>)
  } else {
    return (<p>Loading...</p>)
  }
}
export default Home
