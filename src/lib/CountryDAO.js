import fetch from 'node-fetch'

const NUM_YEAR_RECORDS = 59
const AGGREGATE_REGIONS = /ARB|CEB|CSS|EAP|EAR|EAS|ECA|ECS|EMU|EUU|FCS|HIC|HPC|IBD|IDA|IDB|IBT|IDX|LAC|LCN|LDC|LIC|LMC|LMY|LTE|MEA|MIC|MNA|NAC|ODE|OED|OSS|PRE|PST|SAS|SSA|SSF|TEA|TEC|TLA|TMN|TSA|TSS|UMC|WLD/
class CountryDAO {
  constructor () {
    this.rawData = []
    this.data = []
  }

  hasData () {
    // console.log(`hasData(): typeof this.data = ${typeof this.data}`)
    // console.log(`hasData(): this.data.length = ${this.data.length}`)
    const result = Array.isArray(this.data) && this.data.length > 0
    // console.log(`hasData() says ${result}`)
    return result
  }

  getData () {
    return this.data
  }

  async retrieve () {
    this.rawData = await fetch('/api/country.json')
    const json = await this.rawData.json()
    return json
  }

  adapt (json) {
    const yearKeys = Object.keys(json[0]).filter(key => {
      return /Year_/.test(key)
    })

    const newData = yearKeys.map(year => {
      let min = Number.MAX_SAFE_INTEGER
      let max = Number.MIN_SAFE_INTEGER
      json.forEach(rec => {
        const notNull = !!rec[year]
        const aggregatePop = AGGREGATE_REGIONS.test(rec.Country_Code)

        if (notNull && !aggregatePop) { // i.e. non null
          if (rec[year] < min) min = rec[year]
          if (rec[year] > max) max = rec[year]
        }
      })
      const pop = json.reduce((accumulator, rec) => {
        const notNull = !!rec[year]
        const aggregatePop = AGGREGATE_REGIONS.test(rec.Country_Code)
        if (notNull && !aggregatePop) { // i.e. non null
          accumulator.push({ Country: rec.Country, Country_Code: rec.Country_Code, value: rec[year] })
        }
        return accumulator
      }, [])
      return { meta: { min: min, max: max, year: year }, pop: pop }
    })
    // console.log(`adapt found ${newData.length} records`)
    this.data = newData
  }

  validate (json) {
    const badRecordCount = json.filter(rec => {
      return Object.keys(rec).length !== NUM_YEAR_RECORDS
    }).length
    if (badRecordCount > 0) {
      throw new Error(`CountryDAO.validate(): ${badRecordCount} countries do not have exactly ${NUM_YEAR_RECORDS} records`)
    }
    const beginYear = 'Year_1960'
    const endYear = 'Year_2016'
    const badYearRangeCount = json.filter(rec => {
      return (!(beginYear in rec) || !(endYear in rec))
    }).length
    if (badYearRangeCount > 0) {
      throw new Error(`CountryDAO.validate(): ${badYearRangeCount} countries do not the expected range of records spanning from ${beginYear} to ${endYear}`)
    }
    // console.log('validate completed without error')
  }
}
export default CountryDAO
