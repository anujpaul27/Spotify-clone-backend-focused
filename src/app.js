const express = require('express')
const app = express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const musicRouter = require('./routes/music.routes')

// middleware
app.use(express.json())
app.use(cookieParser())


// routes
app.use('/api/auth/',authRouter)  
app.use('/api/music/', musicRouter)

module.exports = app