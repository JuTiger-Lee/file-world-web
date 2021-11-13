const express = require('express');

const router = express.Router();
const forumController = require('../../controller/api/forum');

router.post('/list', forumController.list);
router.post('/write', forumController.write);

module.exports = router;
