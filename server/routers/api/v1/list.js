'use strict';

const { Router } = require("express");
const router = Router();
const { listApiController } = require('../../../controller').ApiController;

router.route('/')
    .get(listApiController.getAllLists)
    .post(listApiController.createList)
    .delete(listApiController.deleteList)
    
router.route('/:listId')
    .get(listApiController.getSingleList)
    .patch(listApiController.updateList)

module.exports = router;