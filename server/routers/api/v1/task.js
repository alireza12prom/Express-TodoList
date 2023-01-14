'use strict';

const { Router } = require("express");
const router = Router();
const {  taskApiController } = require('../../../controller').ApiController;
const { validateParamsMiddleware } = require('../../../middleware');

router.route('/:listId')
    .get(taskApiController.getAllTask)
    .post(taskApiController.createTask)
    .delete(taskApiController.deleteTask)
    
router.route('/:listId/:taskId')
    .get(taskApiController.getSingleTask)
    .patch(taskApiController.updateTask)
    
router.param('listId', validateParamsMiddleware.verifyListId);
module.exports = router;