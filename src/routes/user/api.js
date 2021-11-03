const express = require('express');
const userController = require('../../controller/api/user');

const router = express.Router();

router.post('/login', userController.login);
router.post('/signup', userController.singup);
router.get('/logout', userController.logout);

module.exports = router;
