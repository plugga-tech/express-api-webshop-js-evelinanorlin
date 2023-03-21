var express = require('express');
require('dotenv').config();
var router = express.Router();
const OrderModel = require('../models/orders-model');

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
    let order = new OrderModel({
      "user": req.body.user,
      "products": req.body.products,
    })
    await order.save()
    res.status(200).json(order)

  } catch{
    res.send('error')
  }

  // SKAPA ORDER FÖR EN SPECIFIK USER 
  // PRODUCTS ÄR EN ARRAY MOTSVARANDE INNEHÅLLET I KUNDVAGN
  // {
//   "user": "{{getUsers.response.body.$[0].id}}",
//   "products": [
// {
//   "productId": "// ID PÅ EN PRODUKT",
//   "quantity": 1
// },
// {
//   "productId": "// ID PÅ EN PRODUKT",
//   "quantity": 2
// }
// ]
// }

});

router.post('/user', async function(req, res){
  // HÄMTA ORDERS FÖR EN USER // SKALL MISSLYCKAS = INGEN KEY  // SVARA MED 401
  try{
    if(req.body.token === process.env.TOKEN){
      let userOrder = await OrderModel.findById(req.body.user);
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