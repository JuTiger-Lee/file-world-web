const express = require('express');

const router = express.Router();

router.get('/list', (req, res) => {
  console.log('rrr', req.query);
  res.render('../views/forum/list');
});

router.get('/detail/:idx', (req, res) => {
  res.render('../views/forum/detail');
});

router.get('/write', (req, res) => {
  res.render('../views/forum/write');
});

module.exports = router;
