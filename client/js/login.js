'use strict';

const loginForm = document.querySelector('.my-login-validation');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const rememberField = document.getElementById('remember')
const formBtn = document.querySelector('.btn-primary');

const token = localStorage.getItem('token') ||sessionStorage.getItem('token');

// check if user already logged in, redirec to /home
(() => {
	if (!token) return;
	location.replace('/client/home.html');
})();

// Post - /auth
loginForm.addEventListener('submit', async (e) => {
	e.preventDefault()
	formBtn.disabled = true;
	formBtn.innerHTML = "Loading...";

	let email = emailField.value.trim();
	let password = passwordField.value.trim();

	// check if password or email was empty string
	if (!email) {
		alert('Email is required');
	} else if (!password) {
		alert('Password is required');
	} else {
		try{
			// post : http://localhost:3000/auth
			let options = { headers: { "Content-Type": "application/json"} };
			let body = {email, password, remember:rememberField.checked};
			let { data: { token } } = await axios.post('/auth', body, options);
	
			/**
			 * if user check `remember me`
			 * 	- save the token in local storage
			 *  + otherwise save the token in session storage
			 */
			if (rememberField.checked) {
				localStorage.setItem('token', token);
			} else {
				sessionStorage.setItem('token', token)
			}
	
			// if response was 200, redirect to home page
			location.replace('/client/home.html');
		} catch (error) {
			console.log(error);
			if (error.response.status === 401) {
				alert('Email or Password is wrong')
			} else {
				alert('Something went wrong! Try again...');
			}
		}
	}
	
	formBtn.disabled = false;
	rememberField.checked = false;
	passwordField.value = '';
	formBtn.innerHTML = "Login";
});
