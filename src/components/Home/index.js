import React, { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
// import Tooltip from '@material-ui/core/Tooltip'
import CountryDAO from 'lib/CountryDAO'
import Util from 'lib/Util'
import YearSelector from 'components/YearSelector'
import BonusControls from 'components/BonusControls'
import './home.css'

const RESIZE_DELAY = 250
const CHART_MARGIN = 20
const BAR_COLORS = [{ bg: '#003f5c', fg: 'white' }, { bg: '#bc5090', fg: 'white' }, { bg: '#ffa600', fg: 'black' }]
const HORIZONTAL_CHAR_WIDTH = 8
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
            {
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
          </div>
        </div>
      </div>)
  } else {
    return (<p>Loading...</p>)
  }
}
export default Home
