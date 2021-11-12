const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('../views/admin/login');
});

router.get('/sign-up', (req, res) => {
  res.render('../views/admin/sign-up');
});

module.exports = router;
