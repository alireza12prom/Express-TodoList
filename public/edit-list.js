const listIDDOM = document.querySelector('.task-list-edit-id')
const listNameDOM = document.querySelector('.task-list-edit-name')
const editFormDOM = document.querySelector('.single-list-form ')
const editBtnDOM = document.querySelector('.task-list-edit-btn')
const formAlertDOM = document.querySelector('.form-alert')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
let tempName

const showlist = async () => {
  try {
    const {
      data: { list },
    } = await axios.get(`/api/v1/lists/${id}`)
    const { _id: listID, name } = list

    listIDDOM.textContent = listID
    listNameDOM.value = name
    tempName = name
  } catch (error) {
    console.error(error)
  }
}

showlist()

editFormDOM.addEventListener('submit', async (e) => {
  editBtnDOM.textContent = 'Loading...'
  e.preventDefault()
  try {
    const listName = listNameDOM.value
    const {
      data: { list },
    } = await axios.patch(`/api/v1/lists/${id}`, {
      name: listName
    })

    const { _id: listID, name } = list

    listIDDOM.textContent = listID
    listNameDOM.value = name
    tempName = name
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, edited list`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    console.error(error)
    listNameDOM.value = tempName
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  editBtnDOM.textContent = 'Edit'
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
