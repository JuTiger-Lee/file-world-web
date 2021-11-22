const express = require('express');
const upload = require('../../middleware/multer');

const router = express.Router();
const userController = require('../../controller/api/user');

router.post('/id-check', userController.idCheck);
router.post('/nickname-check', userController.nicknameCheck);

router.post('/sign-in', userController.signIn);
router.post('/sign-up', userController.singUp);

router.put(
  '/profile-upload',
  upload.single('profile'),
  userController.profileUpload,
);
router.get('/profile', userController.profile);

// router.get('/sign-out', userController.signOut);

module.exports = router;
