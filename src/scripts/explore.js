#!/usr/bin/env node
const fetch = require('node-fetch');
const url =
    'https://pkgstore.datahub.io/JohnSnowLabs/population-figures-by-country/population-figures-by-country-csv_json/data/2159fad77778c3b584f3d396593e0af6/population-figures-by-country-csv_json.json';
const NUM_YEAR_RECORDS = 59;
const getData = async () => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, headers);
  const json = await response.json();
  return json;
};
const convert = json => {
  const yearKeys = Object.keys(json[0]).filter(key => {
    return /Year_/.test(key);
  });
  const newData = yearKeys.map(year => {
    const result = {};
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    json.forEach(rec => {
      if (rec[year]) { // i.e. non null
        if (rec[year] < min) min = rec[year];
        if (rec[year] > max) max = rec[year];
      }
    });
    const pop = json.reduce((accumulator, rec) => {
      if (rec[year]) { // i.e. non null
        accumulator.push({ [rec.Country]: Number((rec[year] / max).toFixed(5)) });
      }
      return accumulator;
    }, []);
    result[year] = { meta: { min: min, max: max }, pop: pop };
    return result;
  });
  return newData;
};
getData()
  .then(json => {
    // console.log(`There are ${json.length} records`)
    // console.log(`country 0 has ${Object.keys(json[0]).length} records`)
    const badRecordCount = json.filter(rec => {
      return Object.keys(rec).length !== NUM_YEAR_RECORDS;
    }).length;
    if (badRecordCount > 0) {
      throw new Error(`${badRecordCount} countries do not have exactly ${NUM_YEAR_RECORDS} records`);
    }
    const beginYear = 'Year_1960';
    const endYear = 'Year_2016';
    const badYearRangeCount = json.filter(rec => {
      return (!(beginYear in rec) || !(endYear in rec));
    }).length;
    if (badYearRangeCount > 0) {
      throw new Error(`${badYearRangeCount} countries do not the expected range of records spanning from ${beginYear} to ${endYear}`);
    }
    return json;
  })
  .then(json => {
    console.log(`json has ${json.length} records`);
    const newData = convert(json);
    console.log(JSON.stringify(newData));
  })
  .catch(e => console.log(e));
