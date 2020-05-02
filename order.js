function Order(quantity,price, type){
    this.quantity = quantity;
    this.type = type
    this.price =  price
}

Object.prototype.reduceQuantity = (quantity)=>{

}

Object.prototype.getType = () => { return this.type }

Object.prototype.getPrice = () => { return this.price }

Object.prototype.getQuantity = () => { return this.quantity }






module.exports = Order;