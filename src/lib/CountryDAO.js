import fetch from 'node-fetch'

const NUM_YEAR_RECORDS = 59
class CountryDAO {
  constructor () {
    this.rawData = []
    this.data = []
  }

  hasData () {
    return Array.isArray(this.data) && this.data.length > 0
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

        if (notNull) { // i.e. non null
          if (rec[year] < min) min = rec[year]
          if (rec[year] > max) max = rec[year]
        }
      })
      const pop = json.reduce((accumulator, rec) => {
        const notNull = !!rec[year]

        if (notNull) { // we have data for this year, this country
          accumulator.push({ Country: rec.Country, Country_Code: rec.Country_Code, value: rec[year] })
        }
        return accumulator
      }, [])
      return { meta: { min: min, max: max, year: year }, pop: pop }
    })
    this.data = newData
  }

  /*
    validate() completes if the service returns the data we are expecting, throws an Error otherwise
   */
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
  }
}
export default CountryDAO
