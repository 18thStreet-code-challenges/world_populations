/*
    This is useful if there are multiple debounces in a single component.
 */
const debounceFactory = () => {
  return (fn, ms) => {
    let timer
    return function () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, arguments)
      }, ms)
    }
  }
}
const millionize = x => (x / 1000000).toFixed(3)
const numberWithCommas = x => x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')

const Util = {
  debounceFactory: debounceFactory,
  millionize: millionize,
  numberWithCommas: numberWithCommas

}
export default Util
