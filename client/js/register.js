'use strict';

const loginForm = document.querySelector('.my-login-validation');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const formBtn = document.querySelector('.btn-primary');

const token = localStorage.getItem('token') ||sessionStorage.getItem('token');
// check if user already logged in, redirec to /home
(() => {
	if (!token) return;
	location.replace('/public/home.html');
})();

// Post - /register
loginForm.addEventListener('submit', async (e) => {
	e.preventDefault()
	formBtn.disabled = true;
	formBtn.innerHTML = "Loading...";
    
    let header = { "Content-Type": "application/json" };
    
    let name = nameField.value.trim();
	let email = emailField.value.trim();
	let password = passwordField.value.trim();
    
    if (!name || !email || !password) {
        alert('Name and Email and Password must be non-empty');
        return ;
    }
    
    let body = {
        name: name,
        email: email,
        password: password
    };

    try{
        let { data: { token } } = await axios.post('/register', body, { headers: header });

        // by default token will save in sessoin storage
        sessionStorage.setItem('token', token)

        // if response was 200, redirect to home page
        location.replace('/client/home.html');
    } catch (error) {
        console.log(error);
        if (error.response.status === 400) {
            alert('you have already registered!');
        } else {
            alert('Something went wrong! Try again...');
        }
    }
	
	formBtn.disabled = false;
	passwordField.value = '';
	formBtn.innerHTML = "Register";
});
