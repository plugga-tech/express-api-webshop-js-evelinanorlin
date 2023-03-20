var express = require('express');
var router = express.Router();
const OrderModel = require('../models/orders-model');

/* GET users listing. */
router.get('/all', async function(req, res, next) {
  let orders = await OrderModel.find()
  res.status(200).json(orders)
  // HÄMTA ALLA ORDERS
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


module.exports = router;