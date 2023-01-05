const listDOM = document.querySelector('.tasks-lists')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.list-form')
const listInputDOM = document.querySelector('.list-input')
const formAlertDOM = document.querySelector('.form-alert')
// Load tasks from /api/tasks
const showLists = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { lists },
    } = await axios.get('/api/v1/lists')
    if (lists.length < 1) {
      listDOM.innerHTML = '<h5 class="empty-list">No list created</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allLists = lists
      .map((list) => {
        const { _id: listID, name } = list
        return `
        <div class="single-task-list">
          <a href="/public/todo-list.html?listID=${listID}"><h5>${name}</h5></a>
          
          <div class="task-list-links">

            <!-- edit link -->
            <a href="/public/list.html?id=${listID}"  class="edit-link">
              <i class="fas fa-edit"></i>
            </a>
          
            <!-- delete btn -->
            <button type="button" class="delete-btn" data-id="${listID}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`
      })
      .join('')
      listDOM.innerHTML = allLists
  } catch (error) {
    listDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showLists()

// delete task /api/tasks/:id

listDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/lists/${id}`)
      showLists()
    } catch (error) {
      console.error(error)
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = listInputDOM.value

  try {
    await axios.post('/api/v1/lists', { name })
    showLists()
    listInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, list created`
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
