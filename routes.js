var express = require('express');
var routes = express.Router();

var Order = require('./order');


const ORDER_ID = [1,2,3,4]
const GLOBAL_TICKER_DATA = [
    {id:1,label:"Google Inc.", ticker:"GOOG"},
    {id:2,label:"Facebook", ticker:"FB"},
    {id:3,label:"Oracle", ticker:"ORCL"},
    {id:4,label:"Zeguro", ticker:"ZGRO"},
]
let order = new Order(300,100,'b')
var BUY_BOOK = {
    1:[order],
    2:[],
    3:[],
    4:[]
}

var SELL_BOOK = {
    1:[],
    2:[],
    3:[],
    4:[]
}



routes.get('/ticker',(req,res)=>{
    res.json(GLOBAL_TICKER_DATA)
})

routes.post('/order', (req,res)=>{
    try{
        console.log(req.body)
        let ticker = req.body.ticker
        
        if(ticker && ORDER_ID.includes(ticker)){
            let order = req.body.order;
            // DETAIL Validation required
            if(order && order.qty && order.price && order.side ){
                let newOrder = new Order(order.qty, order.price, order.side)
                if(order.side == 'b'){
                    BUY_BOOK[ticker].push(newOrder)
                    
                }
                else {
                    SELL_BOOK[ticker].push(newOrder)
                    
                }
                res.json({
                    'buy_book':BUY_BOOK,
                    'sell_book':SELL_BOOK
                })
               
            }
            else{
                throw Error('Invalid Order')
            }
            
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