const loginContainer = document.getElementById('login');
const productsContainer = document.getElementById('productsContainer');
const cartContainer = document.getElementById('cart');
let allProducts= [];

// funktioner föt login
function renderLogin(){
  let loggedInUser = localStorage.getItem('loggedInUser')
  if(loggedInUser){
    alreadyLoggedIn()
    renderProducts()
    return
  }

  localStorage.removeItem('loggedInUser');
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
        <button id="logoutBtn">Log out</button>
        <button id="ordersBtn">See your orders</button>`;

        localStorage.setItem("loggedInUser", user.email);

        document.getElementById('ordersBtn').addEventListener('click', renderOrders);

        document.getElementById('logoutBtn').addEventListener('click', () => {
          localStorage.removeItem("loggedInUser", user.email);
          localStorage.removeItem('inCart');
          renderLogin();
          renderProducts();
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

function alreadyLoggedIn(){
  loginContainer.innerHTML = `
  <h2>You are logged in, lets shop!</h2>
  <button id="logoutBtn">Log out</button>
  <button id="ordersBtn">See your orders</button>`;

  document.getElementById('ordersBtn').addEventListener('click', renderOrders);

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem("loggedInUser");
    renderLogin();
    renderProducts();
    productsContainer.innerHTML = ``;
    cartContainer.innerHTML = ``;
  })
}

// funktion för att se ordrar
function renderOrders(){
  loginContainer.innerHTML = ``;
  loginContainer.innerHTML = `
  <h2>Your orders</h2>`;

  fetch('http://localhost:3000/api/orders/all/1234key1234')
    .then(res => res.json())
    .then(data => {
      fetch('http://localhost:3000/api/users')
        .then(res=> res.json())
        .then(user => {
          let currentUser = localStorage.getItem('loggedInUser');
          let currentUserId;
          user.map(user => {
            if(currentUser === user.email){
              currentUserId = user._id;
              return
            }
          })
          let orders = []
          data.map(order => {
            if(order.user === currentUserId){
              orders.push(order)
            }
          })

          orders.map(order => {
            let productName = []

            order.products.map(product => {
            const productMatchId = allProducts.find(prod => product.productId === prod.productId)
            productName.push({"name": productMatchId.name, "quantity": product.quantity});
            })

            productName.map(product => {
              loginContainer.innerHTML+= `
              <p><b>Product:</b> ${product.name} <b>quantity:</b> ${product.quantity}</p>`;
            })
            loginContainer.innerHTML+= `<hr>`
          })
          loginContainer.innerHTML+=`<button id="backBtn">Back</button>`;
          console.log(document.getElementById('backBtn'))
      
          document.getElementById('backBtn').addEventListener('click', () => {
            loginContainer.innerHTML =``;
            alreadyLoggedIn();
          })
        })
    })
  }
 
// Funktioner för att skapa användare
function renderCreateUser(){
  loginContainer.innerHTML = `
  <h2>Create an account</h2>
  <form>
    <input type="text" placeholder="name" id="nameInput" required><br>
    <input type="email" placeholder="email" id="emailInput" required><br>
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

// funktioner för att visa och hämta produkter
function getAllProducts(){
  fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => {
      let product;
      data.map(data => {
        product = {
          "name": data.name,
          "productId": data._id,
          "quantity": 0,
          "price": data.price
          }
        allProducts.push(product);
      })
    })
}

function renderProducts(){
  fetch('http://localhost:3000/api/categories')
  .then(res => res.json())
  .then(data => {
    productsContainer.innerHTML = `
    <h2>Our bikes</h2>
    <h3>Which bikes are you interested in?</h3>`

    data.map(category => {
      productsContainer.innerHTML +=`
      <button class="categoryBtn" id=${category._id}>${category.name}s</button>`
    })

    productsContainer.innerHTML += `<div id="productList" class="productsList"></div>`

    const productsList = document.getElementById('productList')
    const sortBtn = document.querySelectorAll('.categoryBtn');

    sortBtn.forEach(sortBtn => {
      sortBtn.addEventListener('click', (e) => {
        fetch('http://localhost:3000/api/products')
          .then(res => res.json())
          .then(data => {
            productsList.innerHTML = ``;
            data.map(product => {
              if(e.target.id === product.category){
                productsList.innerHTML += `
                <div>
                <h3>${product.name}</h3>
                <img src="bicycle-solid.svg" height="100" width="100" />
                <h4>Description:</h4>
                <p>${product.description}</p>
                <p><b>Price:</b>${product.price} kr</p>
                <button class="buyBtn" id="${product._id}">Buy</button>
                <p>at the moment we have ${product.lager} ${product.name}s in stock</p>
                </div>`;
                }
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
              productToLocalStorage();
              })
            })
          })
        })
      })
    })
}

// funktioner för kundkorg
function productToLocalStorage(){
  let localStorageArr = [];
  allProducts.map(product => {
    if (product.quantity > 0){
      let toLocal = 
      {"name": product.name, 
      "productId": product.productId, 
      "quantity": product.quantity, 
      "price": product.price};

      JSON.stringify(toLocal);

      localStorageArr.push(toLocal);
      console.log(localStorageArr);
    }
    localStorage.removeItem('inCart')
    localStorage.setItem('inCart', JSON.stringify(localStorageArr));
  })
  renderCart();
}

function renderCart(){
  cartContainer.innerHTML = ``;
  let productsInCart = JSON.parse(localStorage.getItem('inCart'));

  if(productsInCart){
  let totPrice = 0;
  productsInCart.map(product => {
      cartContainer.innerHTML += `
        <h3>${product.name}</h3>
        <p><b>Antal:</b>${product.quantity}</p>
        <p><b>Pris: </b>${product.quantity} st á ${product.price} = ${product.quantity*product.price}</p>`
    totPrice += product.quantity*product.price 
  })
  cartContainer.innerHTML += `
  <h4>Total price: ${totPrice}</h4>
  <button id="buyBtn">Buy now!</button>
  <button id="emptyBtn">Empty your cart</button>`

  document.getElementById('buyBtn').addEventListener('click', sendOrder)
  document.getElementById('emptyBtn').addEventListener('click', () => {
    localStorage.removeItem('inCart');
    allProducts = [];
    getAllProducts();
    cartContainer.innerHTML = `<p>Cart is empty</p>`
  })
  } else{
    cartContainer.innerHTML = `<p>Cart is empty</p>`;
  }
}

function sendOrder(){
  let loggedInUser = localStorage.getItem('loggedInUser');
  localStorage.removeItem('inCart');
  if(loggedInUser){
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

        document.getElementById('backToStartBtn').addEventListener('click', () => {
          renderLogin()
          renderProducts()
          cartContainer.innerHTML=``;
        })
      })
  })
  } else{
    alert('you must be logged in to shop!')
  }
}

renderLogin();
renderProducts();
getAllProducts();
renderCart();