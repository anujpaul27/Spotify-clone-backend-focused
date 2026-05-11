const express = require('express')
const app = express()
require('dotenv').config()
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')


// middleware
app.use(express.json())
app.use(cookieParser())


// routes
app.use('/api/auth/',authRouter) 


module.exports = app