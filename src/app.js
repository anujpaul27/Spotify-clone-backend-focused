const express = require('express')
const app = express()
require('dotenv').config()


// middleware
app.use(express.json())



module.exports = app