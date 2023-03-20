var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/all', function(req, res, next) {
  res.send('respond with a resource');
  // HÄMTA ALLA ORDERS
});

router.post('/add', function(req, res, next) {
  res.send('respond with a resource');
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