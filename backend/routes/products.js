require('dotenv').config();
const CryptoJS = require('crypto-js');
var express = require('express');
var router = express.Router();
const ProductModel = require('../models/products-model');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const products = await ProductModel.find()
  res.status(200).json(products);
});

router.get('/:id', async function(req, res, next) {
  try{
    let id = req.params.id;
    console.log(id)
    const product = await ProductModel.findById(id);
    res.status(200).json(product);
  } catch{
    res.status(400).json('something went wrong');   
  }
});

router.post('/add', function(req, res, next) {
  try{
    let newProduct = req.body;
    let product = new ProductModel(
      {
        "name": newProduct.name,
        "description": newProduct.description,
        "price": newProduct.price,
        "lager": newProduct.lager,
        "category": newProduct.category,
        "token": newProduct.token,
      })

    product.save()

    res.status(200).json('product added')

  } catch{
    res.status(400).json('somethibg went wrong')
  }

  // SKAPA PRODUKT
  //kommer name, description, price, lager
  // SKAPA PRODUKT // UTAN TOKEN SÅ SKALL ANROPET MISSLYCKAS = 401
  
});

module.exports = router;