const express = require('express');
const userController = require('../../controller/api/user');

const router = express.Router();

router.post('/id-check', userController.idCheck);
router.post('/nickname-check', userController.nicknameCheck);
router.post('/sign-in', userController.signIn);
router.post('/sign-up', userController.singUp);
router.get('/sign-out', userController.signOut);

module.exports = router;
