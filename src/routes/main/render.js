const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  console.log('rrr', req.user);
  res.render('../views/main/main');
});

module.exports = router;
