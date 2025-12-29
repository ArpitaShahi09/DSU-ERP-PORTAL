// dsu-portal/backend/routes/attendance.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { userid } = req.query;
  if (!userid) return res.status(400).json({ success: false, message: 'Missing userid' });

  db.query('SELECT * FROM attendance WHERE userid = ?', [userid], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });

    if (!results.length) {
      return res.json({
        success: true,
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0,
        subjects: [],
        absentDays: []
      });
    }

    let total = 0, present = 0, absent = 0;
    const subjects = [];
    const absentDays = [];

    results.forEach(row => {
      subjects.push({
        course: row.subject,
        slot_type: row.slot_type,
        conducted: row.total_classes,
        present: row.present,
        absent: row.absent,
        attendance_percent: (row.present / row.total_classes) * 100
      });

      total += row.total_classes;
      present += row.present;
      absent += row.absent;

      if (row.absent > 0 && row.attendance_date) {
        absentDays.push({
          date: row.attendance_date,
          conducted: row.total_classes,
          present: row.present,
          absent: row.absent
        });
      }
    });

    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      total,
      present,
      absent,
      percentage,
      subjects,
      absentDays
    });
  });
});

module.exports = router;
