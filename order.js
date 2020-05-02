function Order(quantity,price, side,timeStamp){
    this.quantity = quantity;
    this.side = side
    this.price =  price

    this.getSide = () => { return this.type }
    this.getPrice = () => { return this.price }
    this.getQuantity = () => { return this.quantity }
    this.setSide = (side) => { this.side = side }
    this.setPrice = (price) => { this.price =  price }
    this.setQuantity = (quantity) => { this.quantity = quantity }


}









module.exports = Order;