const { Router } = require("express");
const router = Router();

const { 
    ValidateListID, 
    ValidateTaskID } = require("../middleware/validateParams");

const {
    validateBodyOnCreateTask,
    validateBodyOnUpdateTask } = require('../middleware/validateBody');

const { 
    getAllTasks, 
    createTask, 
    singleTask, 
    updateTask, 
    deleteTask } = require("../controller/tasks");

router.route('/:listID')
    .get(getAllTasks)
    .post(validateBodyOnCreateTask, createTask)

router.route('/:listID/:taskID')
    .get(singleTask)
    .delete(deleteTask)
    .patch(validateBodyOnUpdateTask, updateTask);

router.param('listID', ValidateListID);
router.param('taskID', ValidateTaskID);


module.exports = router;
