const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
const cors = require('cors')
const PORT = 3500

var originsWhitelist = [
    'http://localhost:4200',      //this is my front-end url for development
     
  ]

app.use(cors(originsWhitelist))
app.use(bodyParser.json())
app.use('/',routes)

app.listen(PORT,()=>{
    console.log(`[Server] Running on ${PORT}...`)
})