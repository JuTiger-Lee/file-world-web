const express = require('express');

const router = express.Router();
const forumController = require('../../controller/api/forum');

router.get('/list', forumController.list);
router.get('/detail/:idx', forumController.detail);
router.post('/write', forumController.write);
router.get('/count-category', forumController.countCategory);
router.post('/like', forumController.postLike);
router.delete('/un-like/:idx', forumController.postUnLike);

// comment
router.post('/comment/write', forumController.writeComment);

module.exports = router;
