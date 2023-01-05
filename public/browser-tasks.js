const tasksDOM = document.querySelector('.tasks-lists')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputNameDOM = document.getElementById('task-name')
const taskInputDateDOM = document.getElementById('task-date')
const formAlertDOM = document.querySelector('.form-alert')

const params = window.location.search
const listID = new URLSearchParams(params).get('listID')

const convertNameTo12Char = (name) => {
  while (name.length < 12) {
    name += ' '
  }
  return name;
}

// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    // set the name of the list
    const {
      data: { list },
    } = await axios.get(`/api/v1/lists/${listID}`)
    document.getElementById('list-name').innerHTML = `< ${list.name} >`;

    // upload all tasks
    const {
      data: { tasks },
    } = await axios.get(`/api/v1/tasks/${listID}`)
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name, date, intervalInDay } = task;
        let status;
        if (intervalInDay == -1){
          status = 'Tomorrow'
        } else if (intervalInDay == 0) {
          status = 'Today';
        } else if (intervalInDay == 1) {
          status = 'Yesterday'
        }
        return `
        <div class="single-task-list ${completed && 'task-completed'} ${!completed && intervalInDay > 0 ? 'task-faild': 'task-nor'}">
          <pre id='task-title'><span><i class="far fa-check-circle"></i></span>${convertNameTo12Char(name)}</pre>
          <h6>${ date ? (status || new Date(date).toLocaleDateString()) : ''}</h6>
          <div class="task-list-links">
          

            <!-- edit link -->
            <a href="/public/task.html?listID=${listID}&taskID=${taskID}"  class="edit-link">
              <i class="fas fa-edit"></i>
            </a>
          
            <!-- delete btn -->
            <button type="button" class="delete-btn" data-id="${taskID}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        `
      })
      .join('')
      tasksDOM.innerHTML = allTasks
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showTasks()

// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const taskID = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${listID}/${taskID}`)
      showTasks()
    } catch (error) {
      console.error(error)
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = taskInputNameDOM.value
  const date = taskInputDateDOM.value

  try {
    await axios.post(`/api/v1/tasks/${listID}`, { name, date })
    showTasks()
    taskInputNameDOM.value = ''
    taskInputDateDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
