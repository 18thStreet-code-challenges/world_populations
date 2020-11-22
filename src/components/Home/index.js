import React from 'react'
import CountryDAO from 'CountryDAO'
import './home.css'
const SLIDER_DELAY = 250
const RESIZE_DELAY = 250
const CHART_MARGIN = 20
const SLIDER_WIDTH = 300

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
class Home extends React.Component {
  constructor () {
    super()
    this.state = {
      dao: new CountryDAO(),
      hasData: false,
      yearIdx: 0,
      windowWidth: 0,
      barHeight: 20,
      minimumYear: 1960,
      maximumYear: 2016
    }

    // return () => {
    //   window.removeEventListener('resize', debouncedHandleResize)
    // }
  }

  componentDidMount () {
    const that = this

    this.getData()
      .then(success => {
        that.setState({ hasData: that.state.dao.hasData() })
        // console.log(JSON.stringify(this.state.dao.getData()))
      })
      .catch(e => console.log(e))
    const debouncedHandleResize = debounce1(function handleResize () {
      that.setState({ windowWidth: window.innerWidth - CHART_MARGIN })
      console.log(`innerWidth = ${window.innerWidth}`)
    }, RESIZE_DELAY)

    window.addEventListener('resize', debouncedHandleResize)
    this.setState({ windowWidth: window.innerWidth - CHART_MARGIN })
  }

  async getData () {
    const dao = this.state.dao
    const json = await dao.retrieve()
    dao.validate(json)
    dao.adapt(json)
    return true
  }

  render () {
    if (!this.state.hasData) {
      return (<p>Loading...</p>)
    }
    const dao = this.state.dao
    const popData = dao.getData()[this.state.yearIdx].pop
    // console.log(`dao.getData()[this.state.yearIdx].meta = ${JSON.stringify(dao.getData()[this.state.yearIdx].meta)}`)
    const max = dao.getData()[this.state.yearIdx].meta.max
    const min = dao.getData()[this.state.yearIdx].meta.min
    // console.log(`dao.getData().length = ${dao.getData().length}`)
    // console.log(`popData().length = ${popData.length}`)
    const that = this

    return (
      <div>
        <label>Minimum Population</label> <input
          type='range'
          id='minPop' min={min} max={max}
          style={{ width: `${SLIDER_WIDTH}px` }}
          onChange={debounce2(() => {
            const val = document.getElementById('minPop').value
            console.log(`Min slider value = ${val}`)
            this.setState({ minimumYear: val })
          }, SLIDER_DELAY)} />
        <label>Maximum Population</label> <input
          type='range'
          id='maxPop' min={min} max={max}
          style={{ width: `${SLIDER_WIDTH}px` }}
          onChange={debounce3(() => {
            const val = document.getElementById('maxPop').value
            console.log(`Max slider value = ${val}`)
            this.setState({ maximumYear: val })
          }, SLIDER_DELAY)} />
        <div className='card'>
          <div className='card-body'>
            {
              popData.map((item, i) => {
                // console.log(`(${item.value}/${max}) * ${this.state.windowWidth} = ${(item.value / max) * this.state.windowWidth}`)
                const size = item.value
                const style = {
                  width: (size / max) * that.state.windowWidth,
                  height: that.state.barHeight + 'px'
                }
                const text = `${item.Country_Code} - ${item.Country}`
                const inSlidersRange = (size > that.state.minimumYear) && (size < that.state.maximumYear)
                return (
                  inSlidersRange ? (
                    <div className='bar' style={style} key={'c' + i} title={text}>{text}</div>
                  ) : null
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
export default Home
