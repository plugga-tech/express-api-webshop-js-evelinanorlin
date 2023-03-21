var express = require('express');
var router = express.Router();
const CategoriesModel = require('../models/categories-model');

router.get('/', async function(req, res){
  // Skicka alla kategorier
})

router.post('/add', async function(req, res){
  try{
    let category = new CategoriesModel({
      "name": req.body.name,
      "token": req.body.token
  })
  category.save()
  res.status(201).json('category created')
  } catch{
    res.status(401).json('name and token is required')
  }
  // SKAPA KATEGORI, KEY MÅSTE ANGES 
  // UTAN KEY SVARA 401 
  //Kolla upp hur token ska användas
})




module.exports = router;