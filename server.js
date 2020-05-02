const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
const PORT = 3500

app.use(bodyParser.json())
app.use('/',routes)

app.listen(PORT,()=>{
    console.log(`[Server] Running on ${PORT}...`)
})