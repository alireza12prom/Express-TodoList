const { Router } = require("express");
const router = Router();

const { 
    ValidateListID } = require("../middleware/validateParams");

const { 
    validateBodyOnCreateList, 
    validateBodyOnUpdateList } = require("../middleware/validateBody");

const { 
    getAllLists, 
    createList, 
    deleteList, 
    updateList,
    singleList } = require("../controller/lists");


router.route('/')
    .get(getAllLists)
    .post(validateBodyOnCreateList, createList)

router.route('/:listID')
    .get(singleList)
    .delete(deleteList)
    .patch(validateBodyOnUpdateList, updateList);

router.param('listID', ValidateListID);

module.exports = router;
