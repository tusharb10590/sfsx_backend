function Order(quantity,price, side){
    this.quantity = quantity;
    this.side = side
    this.price =  price
}

Object.prototype.reduceQuantity = (quantity)=>{

}

Object.prototype.getSide = () => { return this.type }

Object.prototype.getPrice = () => { return this.price }

Object.prototype.getQuantity = () => { return this.quantity }

Object.prototype.setSide = (side) => { this.side = side }

Object.prototype.setPrice = (price) => { this.price =  price }

Object.prototype.setQuantity = (quantity) => { this.quantity = quantity }






module.exports = Order;