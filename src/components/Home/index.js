import React, { useEffect, useLayoutEffect, useState } from 'react'
import CountryDAO from 'lib/CountryDAO'
import YearSelector from 'components/YearSelector'
import BonusControls from 'components/BonusControls'
import BarChart from 'components/BarChart'
import PopInfo from 'components/PopInfo'
import con from 'lib/consts'
import './home.css'

const dao = new CountryDAO()

const Home = () => {
  const [hasData, setHasData] = useState(false)
  const [yearIdx, setYearIdx] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [barHeight, setBarHeight] = useState(con.WIDE_BARS)
  const [birdsEye, setBirdsEye] = useState(con.birdseye.DEFAULT_OFF)
  const [minPop, setMinPop] = useState(0)
  const [maxPop, setMaxPop] = useState(0)
  const [minPopCutoff, setMinPopCutoff] = useState(0)
  const [maxPopCutoff, setMaxPopCutoff] = useState(0)
  const [entity, setEntity] = useState(con.entity.DEFAULT_COUNTRIES)
  const [ordering, setOrdering] = useState(con.ordering.DEFAULT_SIZE)
  useEffect(() => {
    getData()
      .then(success => {
        setHasData(dao.hasData())
        setMinPopCutoff(dao.getData()[yearIdx].meta.min)
        setMaxPopCutoff(dao.getData()[yearIdx].meta.max)
      })
      .catch(e => console.log(e))

    window.addEventListener('resize', handleWindowResize)
    setWindowWidth(window.innerWidth - con.CHART_MARGIN)
  }, []) // Call once only

  useLayoutEffect(() => { // useLayoutEffect triggers render when done
    if (hasData) {
      setMaxPop(dao.getData()[yearIdx].meta.max)
      setMinPop(dao.getData()[yearIdx].meta.min)
      setMinPopCutoff(dao.getData()[yearIdx].meta.min)
      setMaxPopCutoff(dao.getData()[yearIdx].meta.max)
      setBirdsEye(con.birdseye.DEFAULT_OFF)
      setBarHeight(con.WIDE_BARS)
      setEntity(con.entity.DEFAULT_COUNTRIES)
      setOrdering(con.ordering.DEFAULT_SIZE)
    }
  }, [hasData, yearIdx])

  const getData = async () => {
    const json = await dao.retrieve()
    dao.validate(json)
    dao.adapt(json)
    return true
  }

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth - con.CHART_MARGIN)
  }

  const orderDataByCriteria = () => {
    if (ordering === con.ordering.NAME) {
      dao.getData()[yearIdx].pop.sort((a, b) => {
        if (a.Country < b.Country) {
          return -1
        }
        if (a.Country > b.Country) {
          return 1
        }
        return 0
      })
    } else { // ordering === 'size'
      dao.getData()[yearIdx].pop.sort((a, b) => {
        if (a.value < b.value) {
          return 1
        }
        if (a.value > b.value) {
          return -1
        }
        return 0
      })
    }
  }
  const filterDataByCriteria = () => {
    return dao.getData()[yearIdx].pop.filter((item, i) => {
      // console.log(item)
      const size = item.value

      const isPreferredEntityType =
          entity === con.entity.BOTH ||
          (entity === con.entity.DEFAULT_COUNTRIES && !con.AGGREGATE_REGIONS.test(item.Country_Code)) ||
          (entity === con.entity.REGIONS && con.AGGREGATE_REGIONS.test(item.Country_Code))
      return isPreferredEntityType && (size >= minPopCutoff) && (size <= maxPopCutoff)
    })
  }

  // const filterDataByPopRanges = () => {
  //   return dao.getData()[yearIdx].pop.filter((item, i) => {
  //     const size = item.value
  //     return (size >= minPopCutoff) && (size <= maxPopCutoff)
  //   })
  // }
  const getNewMax = (filteredData) => {
    return filteredData.reduce((newMax, item) => {
      if (item.value > newMax) {
        newMax = item.value
      }
      return newMax
    }, Number.MIN_SAFE_INTEGER)
  }
  if (hasData) {
    orderDataByCriteria()
    const filteredData = filterDataByCriteria()
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
          setBarHeight={setBarHeight} entity={entity} setEntity={setEntity}
          ordering={ordering} setOrdering={setOrdering}
        />
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
