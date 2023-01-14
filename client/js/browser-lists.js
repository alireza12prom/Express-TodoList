'use strict';

const listDOM = document.querySelector('.tasks-lists');
const test = document.querySelector('.back-link');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.list-form');
const listInputDOM = document.querySelector('.list-input');
const formAlertDOM = document.querySelector('.form-alert');
const formBtn = document.querySelector('.submit-btn-create-list');
const token = localStorage.getItem('token') || sessionStorage.getItem('token');


function unauthorizationErrorHandlere() {
  if (localStorage.token) {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }
  location.replace('/client/login.html');
} 

// Get - /api/v1/list
const showLists = async () => {
  loadingDOM.style.visibility = 'visible'

    let header = { 
        headers: { "Authorization": `Bearer ${token}` }
    };

  try {
    const { data: { lists } } = await axios.get('/api/v1/list', header);
    
    if (lists.length < 1) {
        listDOM.innerHTML = '<h5 class="empty-list">No list created</h5>'
        loadingDOM.style.visibility = 'hidden'
        return;
    }

    const allLists = lists
        .map((list) => {
            const { _id: listID, name } = list
            return `
                <div class="single-task-list">
                <a href="/client/todo-list.html?id=${listID}&name=${name}"><h5>${name}</h5></a>
                
                <div class="task-list-links">

                    <!-- edit link -->
                    <a href="/client/list.html?id=${listID}"  class="edit-link">
                    <i class="fas fa-edit"></i>
                    </a>
                
                    <!-- delete btn -->
                    <button type="button" class="delete-btn" data-id="${listID}">
                    <i class="fas fa-trash"></i>
                    </button>
                </div>
                </div>`
        }).join('');
      listDOM.innerHTML = allLists;
    } catch (error) {
        if (error.response.status === 401) {
            unauthorizationErrorHandlere();
        } else {
            listDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
        }
    }
    loadingDOM.style.visibility = 'hidden';
}

// Delete - /api/v1/list
listDOM.addEventListener('click', async (e) => {
    const el = e.target;

    if (el.parentElement.classList.contains('delete-btn')) {
        loadingDOM.style.visibility = 'visible'
    
        let header = { 
            "Authorization": `Bearer ${token}` 
        };
        let body = {
            listId: el.parentElement.dataset.id
        };

        try {
            await axios.delete(`/api/v1/list`, { headers: header, data: body });
            showLists()
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                unauthorizationErrorHandlere();
            } else {
                alert('Something went wrong!');
            }
        }
    }
    loadingDOM.style.visibility = 'hidden'
})

// Post - /api/v1/list
formDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    formBtn.disabled = true;
    formBtn.innerHTML = 'Creating';
    
    
    let name = listInputDOM.value.trim();
    if (!name) {
        alert('Name must be a non-emtpy string');
    } else {
        let header = { 
            "Authorization": `Bearer ${token}`
        };
        
        let body = {
            name: name 
        };
    
        try {
            await axios.post('/api/v1/list', body, { headers: header});
    
            showLists()
            listInputDOM.value = '';
            formAlertDOM.style.display = 'block';
            formAlertDOM.textContent = `success, list created`;
            formAlertDOM.classList.add('text-success');
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                unauthorizationErrorHandlere();
            } else {
                formAlertDOM.style.display = 'block'
                formAlertDOM.innerHTML = `error, please try again`
            }        
        }
    }

    formBtn.disabled = false;
    formBtn.innerHTML = 'submit';
    
    setTimeout(() => {
        formAlertDOM.style.display = 'none'
        formAlertDOM.classList.remove('text-success')
    }, 3000);
});

const logout = () => {
    localStorage.clear();
    sessionStorage.clear();

    location.replace('/client/login.html');
}

test.onclick = logout;
// check if user does not have any token, redirect to login page
(() => {
	if (token) {
        showLists();
    } else {
        location.replace('/client/login.html');
    }
})();