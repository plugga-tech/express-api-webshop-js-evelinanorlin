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

router.post('/add', async function(req, res, next) {
  try{
      let products = ProductModel.find()
      console.log(products)
      let foundProduct = await ProductModel.findOne({"name":req.body.name})

      if(foundProduct){
        res.status(400).json('product is already existing')
        return
      } else{
        if(req.body.token === process.env.TOKEN){
          let newProduct = req.body;
          let product = new ProductModel(
            {
              "name": newProduct.name,
              "description": newProduct.description,
              "price": newProduct.price,
              "lager": newProduct.lager,
              "category": newProduct.category
            })
            
          product.save()
          res.status(200).json('product added')
          return
        } else{
          res.status(401).json('wrong token')
        }
      }
  } catch{
    res.status(400).json('something went wrong')
  }

  // SKAPA PRODUKT
  //kommer name, description, price, lager
  // SKAPA PRODUKT // UTAN TOKEN SÅ SKALL ANROPET MISSLYCKAS = 401
  
});

module.exports = router;