function Order(quantity,price, side,timeStamp,executionPrice,name,tickerLabel){
    this.quantity = quantity;
    this.side = side
    this.price =  price
    this.timeStamp = timeStamp
    this.executionPrice = executionPrice
    this.traderName = name
    this.tickerLabel = tickerLabel

    this.getSide = () => { return this.type }
    this.getPrice = () => { return this.price }
    this.getQuantity = () => { return this.quantity }
    this.setSide = (side) => { this.side = side }
    this.setPrice = (price) => { this.price =  price }
    this.setQuantity = (quantity) => { this.quantity = quantity }


}









module.exports = Order;