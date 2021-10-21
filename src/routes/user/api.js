const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
  // throw new Error('not exiteds user data');
});

router.post('/signup');
router.get('/logout');

module.exports = router;
