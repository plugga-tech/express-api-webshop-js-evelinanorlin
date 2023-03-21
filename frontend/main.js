const loginContainer = document.getElementById('login');

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



renderLogin()