const express = require('express'); 
const router = express.Router();
const db = require('../db');

// Route: GET /api/exam/timetable?userid=ENG001
router.get('/timetable', (req, res) => {
  const query = `
    SELECT et.exam_date, et.time_slot, s.subject_name AS subject
    FROM exam_timetable et
    JOIN subjects s ON et.subject_id = s.subject_id
    ORDER BY et.exam_date
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching exam timetable:', err);
      res.status(500).json({ error: 'Failed to fetch exam timetable' });
    } else {
      res.json(result);
    }
  });
});

router.get('/result', (req, res) => {
  const { userid } = req.query;
  const query = `
    SELECT s.subject_name AS subject, r.mse1, r.mse2
    FROM result r
    JOIN subjects s ON r.subject_id = s.subject_id
    WHERE r.student_id = ?
  `;
  db.query(query, [userid], (err, result) => {
    if (err) {
      console.error('Error fetching results:', err);
      res.status(500).json({ error: 'Failed to fetch results' });
    } else {
      res.json(result);
    }
  });
});

// (Optional: Add results route if needed by frontend like /api/exam/results?userid=ENG001)
// router.get('/results', (req, res) => { ... });

module.exports = router;
