'use strict'

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const port = process.env.PORT || 3001
const passport = require('passport')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const http = require('http')		
// const conn = require('./apps/config/db.config')
const routes = require('./apps/routes/index')
const debug = require('debug')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
app.use(cookieParser())

require("./apps/config/passport")(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use('/', routes)

const db = require('./apps/models')
// db.sequelize.sync()

// db.sequelize.sync({ force: true }).then(() => {
//     let log = debug('crud:dropAndRe')
//     log("Drop and re-sync db.")
// })

const httpServer = http.createServer(app)
httpServer.listen(port, () => {
	let port = httpServer.address().port
	console.log("Server running on http://localhost:" + port)
})  