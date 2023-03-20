const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  lager: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Product', ProductsSchema);