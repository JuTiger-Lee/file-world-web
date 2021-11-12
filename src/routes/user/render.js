const express = require('express');

const router = express.Router();

router.get('/sign-in', (req, res) => {
  res.render('../views/user/sign-in');
});

router.get('/sign-up', (req, res) => {
  res.render('../views/user/sign-up');
});

module.exports = router;
