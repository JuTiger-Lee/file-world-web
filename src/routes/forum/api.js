const express = require('express');

const router = express.Router();
const forumController = require('../../controller/api/forum');

router.get('/list', forumController.list);
router.get('/detail/:idx', forumController.detail);
router.post('/write', forumController.write);
router.post('/comment-write', forumController.commentWrite);
router.post('/post-view', forumController.postView);
router.post('/like', forumController.like);
router.delete('/un-like', forumController.unLike);

module.exports = router;
