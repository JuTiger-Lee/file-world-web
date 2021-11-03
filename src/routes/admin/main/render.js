const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('../views/admin/main');
});

router.get('/login', (req, res) => {
  res.render('../views/admin/login');
});

router.get('/sign-up', (req, res) => {
  res.render('../views/admin/sign-up');
});

module.exports = router;
