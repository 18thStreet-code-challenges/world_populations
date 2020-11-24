import React, { useEffect, useState } from 'react'
import CountryDAO from 'CountryDAO'
import PopSlider from 'components/PopSlider'
import YearSelector from 'components/YearSelector'
import './home.css'

const RESIZE_DELAY = 250
const CHART_MARGIN = 20

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
const Home = () => {
  const [dao] = useState(new CountryDAO())
  const [hasData, setHasData] = useState(false)
  const [yearIdx, setYearIdx] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [barHeight] = useState(20)
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
    }
  }, [hasData, yearIdx])

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
        <PopSlider
          label='Minimum Population' min={minPop} max={maxPop} cutoff={minPopCutoff} id='minPopCutoff'
          handler={() => {
            const val = document.getElementById('minPopCutoff').value
            console.log(`Min slider value = ${val}`)
            if (val < maxPop) {
              setMinPopCutoff(val)
            }
          }} />
        <PopSlider
          label='Maximum Population' min={minPop} max={maxPop} cutoff={maxPopCutoff} id='maxPopCutoff'
          handler={() => {
            const val = document.getElementById('maxPopCutoff').value
            console.log(`Max slider value = ${val}`)
            if (val > minPop) {
              setMaxPopCutoff(val)
            }
          }} />
        <br />
        <YearSelector stateHandler={setYearIdx} />
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
