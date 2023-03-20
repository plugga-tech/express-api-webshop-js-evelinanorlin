var express = require('express');
var router = express.Router();

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
  res.send('respond with a resource');
  // SKAPA PRODUKT
  //kommer name, description, price, lager
  
});

module.exports = router;