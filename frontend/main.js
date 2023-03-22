const loginContainer = document.getElementById('login');
const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
let productsInCart = []

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

        document.getElementById('logoutBtn').addEventListener('click', () => {
          localStorage.removeItem("loggedInUser", user.email);
          renderLogin();
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

      const buyBtn = document.querySelectorAll('.buyBtn');
      
      buyBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
         let bikeToBuy = data.find(x => x._id === e.target.id);
         productsInCart.push(bikeToBuy);
         console.log(productsInCart);
         renderCart()
        })
      })
    })
}

// funktioner för kundkorg

function renderCart(){
  cartContainer.innerHTML = `hello`;
}


renderProducts()
renderLogin()