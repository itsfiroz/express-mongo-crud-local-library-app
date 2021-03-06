let createError 	= require('http-errors')
let express 		= require('express')
let path 			= require('path')
let cookieParser 	= require('cookie-parser')
let logger 			= require('morgan')
let favicon 		= require('serve-favicon')

// DB: Start

// Import the mongoose module
let mongoose = require('mongoose')

// Set up default mongoose connection
let mongoDB = 'mongodb://127.0.0.1/Movies'
mongoose.connect(mongoDB, {useNewUrlParser: true})

// Get mongoose to use the global promise library
mongoose.Promise = global.Promise

// Get the default connection
let db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error'))

// DB: End

let indexRouter     = require('./routes/index')
let usersRouter     = require('./routes/users')
let catalogRouter   = require('./routes/catalog')  //Import routes for "catalog" area of site

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/catalog', catalogRouter) // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
