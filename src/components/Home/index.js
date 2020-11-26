import React, { useEffect, useState } from 'react'
// import Tooltip from '@material-ui/core/Tooltip'
import CountryDAO from 'lib/CountryDAO'
import Util from 'lib/Util'
import YearSelector from 'components/YearSelector'
import BonusControls from 'components/BonusControls'
import BarChart from 'components/BarChart'
import './home.css'

const RESIZE_DELAY = 250
const CHART_MARGIN = 20
const WIDE_BARS = 20

const debounce = Util.debounceFactory()
const Home = () => {
  const [dao] = useState(new CountryDAO())
  const [hasData, setHasData] = useState(false)
  const [yearIdx, setYearIdx] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [barHeight, setBarHeight] = useState(WIDE_BARS)
  const [skinnyBars, setSkinnyBars] = useState(false)
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
    const debouncedHandleResize = debounce(function handleResize () {
      setWindowWidth(window.innerWidth - CHART_MARGIN)
      console.log(`innerWidth = ${window.innerWidth}`)
    }, RESIZE_DELAY)

    window.addEventListener('resize', debouncedHandleResize)
    setWindowWidth(window.innerWidth - CHART_MARGIN)
  }, []) // Call once only

  const getData = async () => {
    const json = await dao.retrieve()
    dao.validate(json)
    dao.adapt(json)
    return true
  }

  useEffect(() => {
    if (hasData) {
      setTimeout(() => {
        setMaxPop(dao.getData()[yearIdx].meta.max)
        setMinPop(dao.getData()[yearIdx].meta.min)
        setMinPopCutoff(dao.getData()[yearIdx].meta.min)
        setMaxPopCutoff(dao.getData()[yearIdx].meta.max)
      }, 300)
    }
  }, [hasData, yearIdx])

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
        </div>
        <BonusControls
          minPop={minPop} maxPop={maxPop} minPopCutoff={minPopCutoff}
          maxPopCutoff={maxPopCutoff} skinnyBars={skinnyBars} setMinPopCutoff={setMinPopCutoff}
          setMaxPopCutoff={setMaxPopCutoff} setSkinnyBars={setSkinnyBars}
          setBarHeight={setBarHeight} />
        <div className='card'>
          <div className='card-body'>
            <BarChart
              filteredData={filteredData} windowWidth={windowWidth} newMax={newMax}
              skinnyBars={skinnyBars} barHeight={barHeight} />
          </div>
        </div>
      </div>)
  } else {
    return (<p>Loading...</p>)
  }
}
export default Home
