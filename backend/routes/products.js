require('dotenv').config();
const CryptoJS = require('crypto-js');
var express = require('express');
var router = express.Router();
const ProductModel = require('../models/products-model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  // HÄMTA ALLA PRODUKTER
});

router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
  // ID PÅ PRODUKT
});

router.post('/add', function(req, res, next) {
  try{
    let newProduct = req.body;
    let product = new ProductModel(
      {
        "name": newProduct.name,
        "description": newProduct.description,
        "price": newProduct.price,
        "lager": newProduct.lager
      })

    product.save()

    res.status(200).json('product added')

  } catch{
    res.status(400).json('somethibg went wrong')
  }

  // SKAPA PRODUKT
  //kommer name, description, price, lager
  
});

module.exports = router;