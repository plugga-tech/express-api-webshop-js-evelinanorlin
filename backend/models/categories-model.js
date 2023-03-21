const mongoose = require('mongoose');

const CategoriesSchema = mongoose.Schema({
  "name": {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('Categories', CategoriesSchema);