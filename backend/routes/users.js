var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  // HÄMTA ALLA USERS 
  // SKICKA INTE MED LÖSENORD 
  // BARA ID, NAMN + EMAIL PÅ ALLA USERS
});

router.post('/', function(req, res, next) {
  res.send('respond with a resource');
  // HÄMTA SPECIFIK USER 
  // SKICKA HELA OBJEKTET
  // från front kommer ett id
})

router.post('/add', function(req, res, next) {
  res.send('respond with a resource');
  // SKAPA USER
  // kommer name, email, password
})

router.post('/login', function(req, res, next) {
  res.send('respond with a resource');
  // LOGGA IN USER
  // Kommer email och password
})



module.exports = router;
