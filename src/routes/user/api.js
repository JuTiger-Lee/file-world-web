const express = require('express');

const router = express.Router();

router.post('/login', function (req, res) {
  res.send('hello');
});

router.post('/signup');
router.get('/logout');

module.exports = router;
