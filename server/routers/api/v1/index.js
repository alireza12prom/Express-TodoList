'use strict';

const { Router } = require("express");
const router = Router();
const listRouter = require("./list");
const taskRouter = require("./task");

router.use('/list', listRouter);
router.use('/task', taskRouter);

module.exports = router;