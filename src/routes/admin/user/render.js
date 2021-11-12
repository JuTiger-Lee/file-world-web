const express = require('express');

const router = express.Router();

router.get('/list', (req, res) => {
  res.render('../views/admin/user/list');
});

module.exports = router;
