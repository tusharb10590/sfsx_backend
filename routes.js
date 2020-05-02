var express = require('express');
var routes = express.Router();

var Order = require('./order');



const GLOBAL_TICKER_DATA = [
    {id:1,label:"Google Inc.", ticker:"GOOG"},
    {id:2,label:"Facebook", ticker:"FB"},
    {id:3,label:"Oracle", ticker:"ORCL"},
    {id:4,label:"Zeguro", ticker:"ZGRO"},
]
let order = new Order(300,100,'b')
var BOOK = {
    1:[order],
    2:[],
    3:[],
    4:[]
}



routes.get('/ticker',(req,res)=>{
    res.json(GLOBAL_TICKER_DATA)
})

routes.post('/order', (req,res)=>{
    try{
        let ticker = req.body.ticker
        if(ticker){

        }
        else{
            res.json({status:'error', message:"Invalid value for Ticker - [1 - GOOG, 2 - FB, 3 - ORCL ,4 - ZGRO]"})
        }
    }
    catch(err){
        console.log(err)
        res.status(500)
        res.json({code:500, message:err.message})
    }
    

})

routes.get('/order', (req,res)=>{
        res.json(BOOK)
})

module.exports = routes