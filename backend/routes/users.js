require('dotenv').config();
const CryptoJS = require('crypto-js');
var express = require('express');
var router = express.Router();
const UserModel = require('../models/users-model');
const { readdirSync } = require('fs');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let allUsers = await UserModel.find().select("-password").select("-loggedIn");
  res.status(200).json(allUsers)
});

router.post('/', async function(req, res, next) {
  let id = req.body.id;
  const currentUsers = await UserModel.find().select("-password").select("-loggedIn");
  const foundUser = currentUsers.find((u) => u.id === id);

  if(foundUser){
    res.status(200).json(foundUser);
    return
  } else{
    res.status(404).json('id not found');
    return
  }

  // HÄMTA SPECIFIK USER 
  // SKICKA HELA OBJEKTET
  // från front kommer ett id

  //Ska jag skicka med lösenord här???
})

router.post('/add', async (req, res, next) => {
  let newUser = req.body;
  let email = newUser.email;
  let name = newUser.name;

  try{
    let cryptPass = CryptoJS.AES.encrypt(newUser.password, process.env.SALT_KEY).toString();
    let user = {name, email, "password": cryptPass};
    const addUser = await UserModel.create(user);
    await addUser.save()

    res.status(201).json('created new user');

  } catch {
    const currentUsers = await UserModel.find();
    const foundUser = currentUsers.find((u) => u.email === email);
    if(foundUser){
      res.status(409).json('email is already taken');
    } else {
      res.status(400).json('something went wrong');
    }
  }
})

router.post('/login', async function(req, res, next) {

  let user = req.body;
  let email = user.email;
  let password = user.password;

  const currentUsers = await UserModel.find();

  const foundUser = currentUsers.find((u) => u.email === email);

  if(foundUser){

    decrypted = CryptoJS.AES.decrypt(foundUser.password, process.env.SALT_KEY).toString(CryptoJS.enc.Utf8);

    if(decrypted === password){
      res.status(200).json('log in successfull')
      return
    } else{
      res.status(401).json('wrong password')
      return
    }
  } else{
    res.status(406).json('user not found')
  }
})



module.exports = router;
