const express = require('express');

const router = express.Router();

router.get('/list', (req, res) => {
  res.render('../views/forum/list');
});

module.exports = router;
