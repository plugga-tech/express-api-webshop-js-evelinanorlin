var express = require('express');
require('dotenv').config();
var router = express.Router();
const OrderModel = require('../models/orders-model');
const ProductModel = require('../models/products-model');

/* GET users listing. */
router.get('/all/:token', async function(req, res, next) {
  try{
    let token = req.params.token;

    if(token === process.env.TOKEN){
      let orders = await OrderModel.find();
      res.status(200).json(orders);
      return
    } else {
      res.status(401).json('wrong token')
    }
  } catch{
    res.status(400).json('something went wrong')
  }
});

router.post('/add', async function(req, res, next) {
  try{
    let productsList = req.body.products;
    let soldOutArr = [];
    
  await Promise.all(productsList.map(async product => {
 
       let currentProduct = await ProductModel.findById(product.productId);
 
       currentProduct.lager = currentProduct.lager - product.quantity;
 
       if(currentProduct.lager < 1){
          soldOutArr.push(product.productId);
         return
       }
         await currentProduct.save();
     }))

     if(soldOutArr.length > 0){
      res.status(400).json(`There are not enogh in store of the following products: ${soldOutArr}`);
      return
     } else{
       let order = new OrderModel({
         "user": req.body.user,
         "products": req.body.products,
       })
       await order.save()
       res.status(200).json(order)
     }
  }catch{
    res.send('error')
  }
});

router.post('/user', async function(req, res){
  // HÄMTA ORDERS FÖR EN USER // SKALL MISSLYCKAS = INGEN KEY  // SVARA MED 401
  try{
    if(req.body.token === process.env.TOKEN){
      let userOrder = await OrderModel.find({"user": req.body.user});
      console.log(userOrder)

      res.status(200).json(userOrder);
      return

    } else{
      res.status(402).json('wrong token');
      return
    }
  } catch {
    res.status(400).json('something went wrong, does the order exist?')
  }
})


module.exports = router;