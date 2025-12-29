const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { userid } = req.query;
  db.query('SELECT * FROM timetable WHERE userid = ?', [userid], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;
