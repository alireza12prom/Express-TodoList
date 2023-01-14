'use strict';

const listIDDOM = document.querySelector('.task-list-edit-id')
const listNameDOM = document.querySelector('.task-list-edit-name')
const editFormDOM = document.querySelector('.single-list-form ')
const editBtnDOM = document.querySelector('.task-list-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const listId = new URLSearchParams(params).get('id')
let tempName
const token = localStorage.getItem('token') ||sessionStorage.getItem('token');

function unauthorizationErrorHandlere() {
    sessionStorage.getItem('token');
    localStorage.removeItem('token');

    location.replace('/client/login.html');
}

// Get - /api/v1/list
const showlist = async () => {
    try {
        let header = {
            "Authorization": `Bearer ${token}`
        };

        const {
        data: { list },
        } = await axios.get(`/api/v1/list/${listId}`, { headers: header });
        const { _id, name } = list

        listIDDOM.textContent = _id
        listNameDOM.value = name
        tempName = name
    } catch (error) {
        console.error(error)
        if (error.response.status === 401) {
          unauthorizationErrorHandlere();
        }
    }
}

// Post - /api/v1/list/:listId
editFormDOM.addEventListener('submit', async (e) => {
    editBtnDOM.textContent = 'Loading...';
    editBtnDOM.disabled = true;
    e.preventDefault()
    try {

        let header = {
            "Authorization": `Bearer ${token}`
        };

        let body = {
            name:listNameDOM.value
        };

        const { data: { list } } = await axios.patch(`/api/v1/list/${listId}`, body, { headers: header });

        const { _id, name } = list

        listIDDOM.textContent = _id
        listNameDOM.value = name
        tempName = name
        formAlertDOM.style.display = 'block'
        formAlertDOM.textContent = `success, edited list`
        formAlertDOM.classList.add('text-success')
    } catch (error) {
        console.error(error)
        if (error.response.status === 401 ) {
            unauthorizationErrorHandlere();
        }
        listNameDOM.value = tempName
        formAlertDOM.style.display = 'block'
        formAlertDOM.innerHTML = `error, please try again`
    }
    
    editBtnDOM.textContent = 'Edit';
    editBtnDOM.disabled = false;

    setTimeout(() => {
        formAlertDOM.style.display = 'none'
        formAlertDOM.classList.remove('text-success')
    }, 3000)
});

// check if user does not have any token, redirect to login page
(() => {
	if (token) {
        showlist();
    } else {
        location.replace('/client/login.html');
    }
})();
