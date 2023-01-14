'use strict';

const tasksDOM = document.querySelector('.tasks-lists')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputNameDOM = document.getElementById('task-name')
const taskInputDateDOM = document.getElementById('task-date')
const formAlertDOM = document.querySelector('.form-alert')
const formBtn = document.querySelector('.submit-btn-create-task');

const params = window.location.search
const listId = new URLSearchParams(params).get('id');

const token = localStorage.getItem('token') || sessionStorage.getItem('token');

function unauthorizationErrorHandlere() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    location.replace('/client/login.html');
}

const convertNameTo12Char = (name) => {
    while (name.length < 12) {
        name += ' '
    }
    return name;
}

// Get - /api/v1/task
const showTasks = async () => {
    loadingDOM.style.visibility = 'visible'
    document.getElementById('list-name').innerHTML = sessionStorage.getItem('current_list_name');
    
    let header = { 
        "Authorization": `Bearer ${token}`
    };

    try {
        const { data: { tasks } } = await axios.get(`/api/v1/task/${listId}`, { headers: header});

        if (tasks.length < 1) {
            tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
            loadingDOM.style.visibility = 'hidden';
            return;
        }

        const allTasks = tasks
        .map((task) => {
            const { completed, _id: taskId, name, date, missedDays } = task;

            let status;
            if (missedDays === -1){
                status = 'Tomorrow';
            } else if (missedDays === 0) {
                status = 'Today';
            } else if (missedDays === 1) {
                status = 'Yesterday';
            }
            return `
                <div class="single-task-list ${completed && 'task-completed'} ${!completed && missedDays > 0 ? 'task-faild': 'task-nor'}">
                <pre id='task-title'><span><i class="far fa-check-circle"></i></span>${convertNameTo12Char(name)}</pre>
                <h6>${ date ? (status || new Date(date).toLocaleDateString()) : ''}</h6>
                <div class="task-list-links">
                

                    <!-- edit link -->
                    <a href="/client/task.html?listID=${listId}&taskID=${taskId}"  class="edit-link">
                    <i class="fas fa-edit"></i>
                    </a>
                
                    <!-- delete btn -->
                    <button type="button" class="delete-btn" data-id="${taskId}">
                    <i class="fas fa-trash"></i>
                    </button>
                </div>
                </div>
            `
        }).join('');
        tasksDOM.innerHTML = allTasks;
    } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
            unauthorizationErrorHandlere();
        }
        tasksDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
    }
    loadingDOM.style.visibility = 'hidden';
}

// Delete - /api/v1/task
tasksDOM.addEventListener('click', async (e) => {
    const el = e.target
    if (el.parentElement.classList.contains('delete-btn')) {
        loadingDOM.style.visibility = 'visible'
        const taskId = el.parentElement.dataset.id
        
        let header = { 
            "Authorization": `Bearer ${token}`
        };

        let body = {
            taskId: taskId
        };

        try {
            await axios.delete(`/api/v1/task/${listId}`, { headers: header, data: body});
            showTasks();
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                unauthorizationErrorHandlere();
            }
            alert('Something went wrong!!');
        }
    }
    loadingDOM.style.visibility = 'hidden'
})

// Post - /api/v1/task
formDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    formBtn.innerHTML = 'Creating';
    formBtn.disabled = true;

    let header = { 
        "Authorization": `Bearer ${token}`
    };

    let name = taskInputNameDOM.value.trim();
    if (!taskInputNameDOM.value.trim()) {
        alert("Title must be a non-empty string!!");
        return;
    }

    let body = {
        name: name,
        date: taskInputDateDOM.value || null
    };

    try {
        await axios.post(`/api/v1/task/${listId}`, body, { headers: header });
        showTasks();

        taskInputNameDOM.value = '';
        taskInputDateDOM.value = '';
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = `success, task added`;
        formAlertDOM.classList.add('text-success');
    } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
            unauthorizationErrorHandlere();
        }
        formAlertDOM.style.display = 'block';
        formAlertDOM.innerHTML = `error, please try again`;
    }

    formBtn.innerHTML = 'submit';
    formBtn.disabled = false;
    setTimeout(() => {
        formAlertDOM.style.display = 'none'
        formAlertDOM.classList.remove('text-success')
    }, 3000);
});


// check if user does not have any token, redirect to login page
(() => {
	if (token) {
        const listName = new URLSearchParams(params).get('name');
        if (listName) {
            sessionStorage.setItem('current_list_name', listName );
        }
        showTasks();
    } else {
        location.replace('/client/login.html');
    }
})();

// document.getElementById('list-name').innerHTML = `< ${list.name} >`;