const loginContainer = document.getElementById('login');
const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
let allProducts= [];


// funktioner för login

function renderLogin(){
  loginContainer.innerHTML = `
    <h2>Log in to shop!</h2>
    <form>
      <input type="text" placeholder="email" id="loginEmail"><br>
      <input type="password" placeholder="password" id="loginPassword"><br>
      <button type="button" id="loginBtn">Log in</button>
    </form>
    <h2>Not a member?</h2>
    <button id="createBtn">Create acccount</button>`;

    let loginBtn = document.getElementById('loginBtn');
    let createBtn = document.getElementById('createBtn');

    createBtn.addEventListener('click', renderCreateUser);
    loginBtn.addEventListener('click', loginFunction);
}

function loginFunction(){
  let emailInput = document.getElementById('loginEmail');
  let passwordInput = document.getElementById('loginPassword');

  let user = {"email": emailInput.value, "password": passwordInput.value}

  fetch('http://localhost:3000/api/users/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then(data => {
      if(data === 'log in successfull'){

        loginContainer.innerHTML = `
        <h2>You are logged in, lets shop!</h2>
        <button id="logoutBtn">Log out</button>`;

        localStorage.setItem("loggedInUser", user.email);
        renderProducts();

        document.getElementById('logoutBtn').addEventListener('click', () => {
          localStorage.removeItem("loggedInUser", user.email);
          renderLogin();
          productsContainer.innerHTML = ``;
          cartContainer.innerHTML = ``;
        })

      } else{
        if(data === 'user not found'){
          alert('wrong email adress')
        } else if(data === 'wrong password'){
          alert('wrong password')
        } else{
          alert('something went wrong')
        }
      }
    })
}

function renderCreateUser(){
  loginContainer.innerHTML = `
  <h2>Create an account</h2>
  <form>
    <input type="text" placeholder="name" id="nameInput" required><br>
    <input type="text" placeholder="email" id="emailInput" required><br>
    <input type="password" placeholder="password" id="passwordInput" required><br>
    <button type="button" id="newUserBtn">Create account</button>
  </form>
  <button id="backToLogin">Back to login</button>`;

  let backToLoginBtn = document.getElementById('backToLogin');
  let createUserBtn = document.getElementById('newUserBtn');

  createUserBtn.addEventListener('click', createNewUser);

  backToLoginBtn.addEventListener('click', renderLogin);
}

function createNewUser(){
  let nameInput = document.getElementById('nameInput');
  let emailInput = document.getElementById('emailInput');
  let passwordInput = document.getElementById('passwordInput');

  let newUser = {"name": nameInput.value, "email": emailInput.value, "password": passwordInput.value}

  fetch('http://localhost:3000/api/users/add', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser)
  })
    .then(res => res.json())
    .then(data => {
      if(data === 'created new user'){
        loginContainer.innerHTML = `
          <h2>User created!</h2>
          <button id="backToLoginBtn">Back to login</button>`
          document.getElementById('backToLoginBtn').addEventListener('click', renderLogin)
      } else if(data === 'email is already taken'){
        alert('email is already taken');
      } else{
          alert('something went wrong')
      }
    })
}

// funktioner för produkter

function renderProducts(){
  productsContainer.innerHTML = `<h2>Our bikes</h2>`
  fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => {
      data.map(data => {
        productsContainer.innerHTML += `
        <h3>${data.name}</h3>
        <h4>Description:</h4>
        <p>${data.description}</p>
        <p><b>Price:</b>${data.price} kr</p>
        <button class="buyBtn" id="${data._id}">By this bike</button>
        <p>at the moment we have ${data.lager} ${data.name}s in stock</p>`;
      })

      data.map(data => {
        product = {
          "name": data.name,
          "productId": data._id,
          "quantity": 0,
          "price": data.price
        }

        allProducts.push(product)
      })
      const buyBtn = document.querySelectorAll('.buyBtn');
    
      buyBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
         let currentBike = (data.find(x => x._id === e.target.id))._id;

         allProducts.map(product => {
          if(product.productId === currentBike){
            product.quantity += 1;
          }
         })
        renderCart();
      })
    })
  })
}

// funktioner för kundkorg

function renderCart(){
  cartContainer.innerHTML = ``;
  let totPrice = 0;
  allProducts.map(product => {
    if(product.quantity > 0){
      cartContainer.innerHTML += `
        <h3>${product.name}</h3>
        <p><b>Antal:</b>${product.quantity}</p>
        <p><b>Pris: </b>${product.quantity} st á ${product.price} = ${product.quantity*product.price}</p>`
    }
    totPrice += product.quantity*product.price 
  })
  cartContainer.innerHTML += `
  <h4>Total price: ${totPrice}</h4>
  <button id="buyBtn">Buy now!</button>`

  document.getElementById('buyBtn').addEventListener('click', sendOrder)
}

function sendOrder(){
  let productsArr = []

  allProducts.map(product => {
    let productToArr;
    if(product.quantity > 0){
      productToArr = {
        "productId": product.productId,
        "quantity": product.quantity
      }
      productsArr.push(productToArr)
    }
  })

  fetch('http://localhost:3000/api/users')
  .then(res => res.json())
  .then(data => {
    let userMail = localStorage.getItem('loggedInUser');
    let userId;
    
    data.map(user => {
      if(user.email === userMail){
        userId = user._id;
      }
    })

    let order = {
      "user": userId,
      "products": productsArr
    }

    fetch('http://localhost:3000/api/orders/add', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        loginContainer.innerHTML=``;
        productsContainer.innerHTML = ``;
        cartContainer.innerHTML = `
        <h3>Thanks for your order, have a nice biking tour!</h3>
        <button id="backToStartBtn">Back to startpage</button>`
        localStorage.removeItem('loggedInUser');

        document.getElementById('backToStartBtn').addEventListener('click', () => {
          renderLogin()
          cartContainer.innerHTML=``;
        })
      })
  })
}

renderLogin()