const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/details', (req, res) => {
  const { userid } = req.query;
  db.query('SELECT * FROM students WHERE userid = ?', [userid], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

router.get('/notices', (req, res) => {
  db.query('SELECT * FROM notices ORDER BY date_posted DESC LIMIT 5', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;
