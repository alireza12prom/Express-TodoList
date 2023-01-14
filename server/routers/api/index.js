'use strict';

const { Router } = require("express");
const router = Router();
const ApiV1Router = require('./v1');

router.use('/v1', ApiV1Router);

module.exports = router;