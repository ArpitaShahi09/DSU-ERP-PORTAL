const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {
  const { userid, password } = req.body;
  const sql = "SELECT * FROM students WHERE userid = ? AND password = ?";
  db.query(sql, [userid, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

module.exports = router;
