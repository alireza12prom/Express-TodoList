const { Router } = require('express');
const { join, dirname } = require('path');

const router = Router();

router.get("/", (request, response) => {
    response.sendFile(join(dirname(dirname(__dirname)), '/client/login.html'));
})

module.exports = router;