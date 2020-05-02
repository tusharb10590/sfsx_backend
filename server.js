const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
const PORT = 3500


app.use('/',routes)
app.set(bodyParser)
app.listen(PORT,()=>{
    console.log(`[Server] Running on ${PORT}...`)
})