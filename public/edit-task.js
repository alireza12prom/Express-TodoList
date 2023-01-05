const taskIDDOM = document.querySelector('.task-list-edit-id')
const taskNameDOM = document.querySelector('.task-list-edit-name')
const taskDateDOM = document.querySelector('.task-list-edit-date')
const taskCompletedDOM = document.querySelector('.task-edit-completed')
const editFormDOM = document.querySelector('.single-task-form')
const editBtnDOM = document.querySelector('.task-list-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')

const params = window.location.search
const urlSearch = new URLSearchParams(params)
const listID = urlSearch.get('listID')
const taskID = urlSearch.get('taskID')
let tempName

// convert mm/dd/yyyy to yyyy/mm/dd
const yearMonthDay = (date) => {
  date = new Date(date)
  let d = date.getDate()      
  let m = date.getMonth() + 1 // because start from 0
  let y = date.getFullYear()
  return `${y}-${m > 9 ? m : `0${m}`}-${d > 9 ? d : `0${d}`}`
}



const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${listID}/${taskID}`)
    let { _id: id, completed, name, date } = task
    

    taskIDDOM.textContent = id
    taskNameDOM.value = name
    tempName = name
    
    if (completed) taskCompletedDOM.checked = true
    if (date) taskDateDOM.value = yearMonthDay(date)
    else taskDateDOM.value = ''
    
    document.getElementById('back-link').href = `/public/todo-list.html?listID=${listID}`
  } catch (error) {
    console.log(error)
  }
}

showTask()

editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...'
  e.preventDefault()
  try {
    const taskName = taskNameDOM.value
    const taskCompleted = taskCompletedDOM.checked
    const taskDate = taskDateDOM.value
    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${listID}/${taskID}`, {
      name: taskName,
      completed: taskCompleted,
      date: taskDate
    })

    let { _id: id, completed, name, date } = task

    taskIDDOM.textContent = id
    taskNameDOM.value = name
    tempName = name

    if (completed) taskCompletedDOM.checked = true
    if (date) taskDateDOM.value = yearMonthDay(date)
    else taskDateDOM.value = ''

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited task`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    taskNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
