import React, { useEffect, useState } from 'react'
import CountryDAO from 'CountryDAO'
import './home.css'

const SLIDER_DELAY = 250
const RESIZE_DELAY = 250
const CHART_MARGIN = 20
const SLIDER_WIDTH = 300
const MINIMUM_YEAR = 1960
const MAXIMUM_YEAR = 2016
const NUMBER_OF_YEARS = (MAXIMUM_YEAR - MINIMUM_YEAR) + 1

function debounce1 (fn, ms) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}
function debounce2 (fn, ms) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}
function debounce3 (fn, ms) {
  let timer
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  }
}
const Home = () => {
  const [dao] = useState(new CountryDAO())
  const [hasData, setHasData] = useState(false)
  const [yearIdx, setYearIdx] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [barHeight] = useState(20)
  // const [minimumYear, setMinimumYear] = useState(1960)
  // const [maximumYear, setMaximumYear] = useState(2016)
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
    const debouncedHandleResize = debounce1(function handleResize () {
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
      console.log('useEffect on populations')
      setMaxPop(dao.getData()[yearIdx].meta.max)
      setMinPop(dao.getData()[yearIdx].meta.min)
      // setMaxPopCutoff(dao.getData()[yearIdx].meta.max)
      // setMinPopCutoff(dao.getData()[yearIdx].meta.min)
    }
  }, [hasData, yearIdx])

  useEffect(() => {
    console.log(`minPopCutoff (${minPopCutoff}) and/or maxPopCutoff (${maxPopCutoff}) has changed`)
  }, [minPopCutoff, maxPopCutoff])

  useEffect(() => {
    console.log(`minPop (${minPop}) and/or maxPop (${maxPop}) has changed`)
  }, [minPop, maxPop])

  const filterDataByPopRanges = () => {
    return dao.getData()[yearIdx].pop.filter((item, i) => {
      const size = item.value
      return (size > minPopCutoff) && (size < maxPopCutoff)
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
      <div>
        <label>Minimum Population</label> <input
          type='range'
          id='minPopCutoff' min={minPop} max={maxPop}
          defaultValue={minPopCutoff}
          step={1}
          style={{ width: `${SLIDER_WIDTH}px` }}
          onChange={debounce2(() => {
            const val = document.getElementById('minPopCutoff').value
            console.log(`Min slider value = ${val}`)
            if (val < maxPop) {
              setMinPopCutoff(val)
            }
          }, SLIDER_DELAY)} />
        <label>Maximum Population</label> <input
          type='range'
          id='maxPopCutoff' min={minPop} max={maxPop}
          defaultValue={maxPopCutoff}
          step={1}
          style={{ width: `${SLIDER_WIDTH}px` }}
          onChange={debounce3(() => {
            const val = document.getElementById('maxPopCutoff').value
            console.log(`Max slider value = ${val}`)
            if (val > minPop) {
              setMaxPopCutoff(val)
            }
          }, SLIDER_DELAY)} />
        <br />
        <select
          id='yearIdxSelector' defaultValue={MAXIMUM_YEAR}
          onChange={(e) => {
            setYearIdx(e.target.value)
          }}>
          {
            Array.from(Array(NUMBER_OF_YEARS).keys()).map((idx) => {
              const label = MINIMUM_YEAR + idx + ''
              return <option value={idx} key={`years${idx}`}>{label}</option>
            })
          }
        </select>
        <div className='card'>
          <div className='card-body'>
            {
              filteredData.map((item, i) => {
                // console.log(`(${item.value}/${max}) * ${this.state.windowWidth} = ${(item.value / max) * this.state.windowWidth}`)
                const size = item.value
                const barWidth = (size / newMax) * windowWidth
                const style = {
                  width: barWidth,
                  height: barHeight + 'px'
                }
                const text = `${item.Country_Code} - ${item.Country}`
                return (
                  <div className='bar' style={style} key={'c' + i} title={text}>{text}</div>
                )
              })
            }
          </div>
        </div>
      </div>)
  } else {
    return (<p>Loading...</p>)
  }
}
export default Home
