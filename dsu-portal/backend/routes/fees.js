const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { userid } = req.query;
  db.query('SELECT * FROM fees WHERE userid = ?', [userid], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(results[0]);
  });
});

module.exports = router;


