const express = require('express')
const app = express()
const port = process.env.PORT || 5000

// See the corresponding app.use() calls later
const restRoutes = require('./routes/api')

// This will capture errors in Promise handling that for some reason don't throw normal NodeJs exceptions
// Usually they come from ServerUtil or Semaphore.  This is a good file to put
// this in because the file is loaded only once.
process.on('unhandledRejection', (reason, p) => {
  console.log('ERROR: unhandled Promise Rejection:', reason, '\nStack trace:\n', p)
})

// Order is probably critical for these...make sure you know what you're doing
// These should corresponde to the require()'s above
app.use('/api', restRoutes) // Will catch any other paths beginning '/api'

// If the url didn't bind to any one of the above routes, then it's an an unknown path.
// Treat it as a 404
app.use(function (req, res, next) {
  var mesg = req.url + ' is not a known service request in CQAT',
    result = { success: false, mesg: mesg },
    err = new Error(result)

  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  var result = err

  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  if (!err.status) {
    result.mesg = 'Server error processing service ' + req.url + ', error = ' + err.message
  }
  res.send(result)
})

app.listen(port, () => console.log(`INFO: REST server now listening on port ${port}`))
