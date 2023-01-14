'use strict';

const taskIDDOM = document.querySelector('.task-list-edit-id');
const taskNameDOM = document.querySelector('.task-list-edit-name');
const taskDateDOM = document.querySelector('.task-list-edit-date');
const taskCompletedDOM = document.querySelector('.task-edit-completed');
const editFormDOM = document.querySelector('.single-task-form');
const editBtnDOM = document.querySelector('.task-list-edit-btn');
const formAlertDOM = document.querySelector('.form-alert');

const params = window.location.search;
const urlSearch = new URLSearchParams(params);
const listId = urlSearch.get('listID');
const taskId = urlSearch.get('taskID');
const token = localStorage.getItem('token') ||sessionStorage.getItem('token');
let tempName;


// convert mm/dd/yyyy to yyyy/mm/dd
const yearMonthDay = (date) => {
  date = new Date(date)
  let d = date.getDate()      
  let m = date.getMonth() + 1 // because start from 0
  let y = date.getFullYear()
  return `${y}-${m > 9 ? m : `0${m}`}-${d > 9 ? d : `0${d}`}`
}

function unauthorizationErrorHandlere() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    location.replace('/client/login.html');
} 

// Get - /api/v1/task/:listId/:taskId
const showTask = async () => {
    try {
        let header = {
            "Authorization": `Bearer ${token}`
        };

        const { data: { task } } = await axios.get(`/api/v1/task/${listId}/${taskId}`, { headers: header });
        console.log(task);
        let { _id, completed, name, date } = task
    

        tempName = name
        taskIDDOM.textContent = _id
        taskNameDOM.value = name
        taskCompletedDOM.checked = completed;
        taskDateDOM.value = date ? yearMonthDay(date) : '';
                
        document.getElementById('back-link').href = `/client/todo-list.html?id=${listId}`
    } catch (error) {
        console.log(error)
        if (error.response.status === 401) {
            unauthorizationErrorHandlere();
        }
    }
}

// Patch - /api/v1/task/:listId/:taskId
editFormDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    editBtnDOM.textContent = 'Loading...';
    editBtnDOM.disabled = true;
    
    let header = {
        "Authorization": `Bearer ${token}`
    };

    let body = {
        name: taskNameDOM.value.trim(),
        date: taskDateDOM.value,
        completed: taskCompletedDOM.checked
    };
    console.log(body);
    try {
        const { data: { task } } = await axios.patch(`/api/v1/task/${listId}/${taskId}`, body, { headers: header });
        let { _id, completed, name, date } = task;

        tempName = name;
        taskIDDOM.textContent = _id;
        taskNameDOM.value = name;
        taskCompletedDOM.checked = completed;
        taskDateDOM.value = date ? yearMonthDay(date) : '';

        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = `success, edited task`;
        formAlertDOM.classList.add('text-success');
    } catch (error) {
        console.error(error);
        if (error.response.status === 401) {
            unauthorizationErrorHandlere();
        }
        taskNameDOM.value = tempName
        formAlertDOM.style.display = 'block'
        formAlertDOM.innerHTML = `error, please try again`
    }

    editBtnDOM.textContent = 'Edit'
    editBtnDOM.disabled = false;

    setTimeout(() => {
        formAlertDOM.style.display = 'none'
        formAlertDOM.classList.remove('text-success')
    }, 3000);
});

// check if user does not have any token, redirect to login page
(() => {
	if (token) {
        showTask();
    } else {
        location.replace('/client/login.html');
    }
})();