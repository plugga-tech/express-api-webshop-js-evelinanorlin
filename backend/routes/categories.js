var express = require('express');
require('dotenv').config();
var router = express.Router();
const CategoriesModel = require('../models/categories-model');

router.get('/', async function(req, res){
  try{
    let categories = await CategoriesModel.find()
    res.status(200).json(categories)
  } catch{
    res.send({message: "error"})
  }
})

router.post('/add', async function(req, res){
  try{
    let foundCategory = await CategoriesModel.findOne({"name":req.body.name})

    if(foundCategory){
      res.status(400).json('category is already existing')
      return
    } else{
      if(req.body.token === process.env.TOKEN){
        let category = new CategoriesModel(
          {
            "name": req.body.name,
          })

        category.save()
        res.status(200).json('category added')

        return
      } else{
        res.status(401).json('wrong token')
      }
    }
  }catch{
    res.status(400).json('something went wrong')
  }
})
module.exports = router;