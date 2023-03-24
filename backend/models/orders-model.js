const mongoose = require('mongoose');

const OrdersSchema = mongoose.Schema({
  "user": {
    type: String,
    reqiured: true
  },
  "products": [{
    "productId": {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      reqiured: true
    },
    "quantity": {
        type: Number,
        reqiured: true
    }
}]
})

module.exports = mongoose.model('Order', OrdersSchema);