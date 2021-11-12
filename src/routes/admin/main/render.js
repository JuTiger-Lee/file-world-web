const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('../views/admin/main/main');
});

module.exports = router;
