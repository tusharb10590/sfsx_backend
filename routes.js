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
let order = new Order(300,100,'b',(new Date()).getTime())
var BUY_BOOK = {
    1:[],
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

var NEW_ORDER_QUEUE = []

var ACTIVITY_LOG = []



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
                let newOrder = new Order(order.qty, order.price, order.side,(new Date()).getTime(),0,order.name); 
                let status = executeOrder(newOrder,ticker)
                if(!status){
                    if(order.side == 'b'){
                        BUY_BOOK[ticker].push(newOrder)
                        
                    }
                    else {
                        SELL_BOOK[ticker].push(newOrder)
                        
                    }

                }
             
                res.json({
                    'buy_book':BUY_BOOK,
                    'sell_book':SELL_BOOK,
                    'activity_log':ACTIVITY_LOG
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
    res.json({
        'buy_book':BUY_BOOK,
        'sell_book':SELL_BOOK,
        'activity_log':ACTIVITY_LOG
    })
})


routes.get('/logs', (req,res)=>{
    res.json({
        
        'activity_log':ACTIVITY_LOG
    })
})

routes.get('/order/:id', (req,res)=>{
    res.json({
        'buy_book':BUY_BOOK[1],
        'sell_book':SELL_BOOK[1]
        
    })
})


function executeOrder(newOrder,ticker){
    let executeStatus = false;
    if(newOrder.side == 'b'){
        console.log("********* BUY-SIDE***********")

        // check against sell
        let minRestingSellOrder =  new Order(999999,0, 'buffer');
            minIndex = -1
        
            SELL_BOOK[ticker].forEach((restingOrder, i)=>{
                if((newOrder.price >= restingOrder.price) && (restingOrder.quantity > 0)){
                    if(minRestingSellOrder.side == 'buffer'){
                        minRestingSellOrder = restingOrder
                    }
                    if(restingOrder.price < minRestingSellOrder.price){
                        minRestingSellOrder = restingOrder
                        minIndex = i
                    }
                    
                }
            })
            console.log('BUY_STATE',SELL_BOOK[ticker], minRestingSellOrder, newOrder,minIndex)

            if(minRestingSellOrder.side !== 'buffer'){
                executeStatus = true
                newOrder.executionPrice = minRestingSellOrder.getPrice()
                if(newOrder.quantity == minRestingSellOrder.quantity){
                    console.log("BUY = SELL")
                    SELL_BOOK[ticker].splice(minIndex,1)
                }
                else if( newOrder.quantity > minRestingSellOrder.quantity){
                    
                    let difference = newOrder.quantity - minRestingSellOrder.quantity;
                    SELL_BOOK[ticker].splice(minIndex,1) 
                    newOrder.setQuantity(difference)
                    BUY_BOOK[ticker].push(newOrder)
                    console.log("BUY > SELL ; BUFFER", difference)
                }
                else if(newOrder.quantity < minRestingSellOrder.quantity){
                    let difference = minRestingSellOrder.quantity - newOrder.quantity
                    minRestingSellOrder.setQuantity(difference)
                    SELL_BOOK[ticker][minIndex] = minRestingSellOrder
                    
                    
                    console.log("BUY  < SELL ; BUFFER", difference)

                }
                ACTIVITY_LOG.push(newOrder)
            }

            

    }
    else if(newOrder.side == 's'){

        // check against buy
        console.log("********* SELL-SIDE***********")
      let maxRestingBuyOrder =  new Order(0,0, 'buffer');
      maxIndex = -1
  
      BUY_BOOK[ticker].forEach((restingOrder, i)=>{
          if((newOrder.price <= restingOrder.price) && (restingOrder.quantity > 0)){
              if(maxRestingBuyOrder.side == 'buffer'){
                  maxRestingBuyOrder = restingOrder
              }
              else if(restingOrder.price > maxRestingBuyOrder.price){
                  maxRestingBuyOrder = restingOrder
                  maxIndex = i 
              }
              
          }
      })
      console.log('SELL STATE',BUY_BOOK[ticker], maxRestingBuyOrder, newOrder,maxIndex)

      if(maxRestingBuyOrder.side !== 'buffer'){
        executeStatus = true
        newOrder.executionPrice = maxRestingBuyOrder.getPrice()
          if(newOrder.quantity == maxRestingBuyOrder.quantity){
            console.log("BUY = SELL")
              BUY_BOOK[ticker].splice(maxIndex,1)
          }
          else if( newOrder.quantity > maxRestingBuyOrder.quantity){
              let difference = newOrder.quantity - maxRestingBuyOrder.quantity;
              BUY_BOOK[ticker].splice(maxIndex,1) 
              newOrder.setQuantity(difference)
              SELL_BOOK[ticker].push(newOrder)
              console.log("BUY < SELL ; BUFFER", difference)
          }
          else if(newOrder.quantity < maxRestingBuyOrder.quantity){
              let difference = maxRestingBuyOrder.quantity - newOrder.quantity
              maxRestingBuyOrder.setQuantity(difference)
              BUY_BOOK[ticker][maxIndex] = maxRestingBuyOrder
              console.log("BUY  >  SELL ; BUFFER", difference)

          }
          ACTIVITY_LOG.push(newOrder)
      }
    }

    return executeStatus;

}

module.exports = routes