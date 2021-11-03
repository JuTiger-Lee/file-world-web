const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('../views/user/login');
});

router.get('/sign-up', (req, res) => {
  res.render('../views/user/sign-up');
});

module.exports = router;
