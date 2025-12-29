const express = require('express');
const cors = require('cors');
const path = require('path');
const loginRoute = require("./routes/login");
const feesRoute = require("./routes/fees");
const examRoutes = require('./routes/exam');
const professorsRoutes = require('./routes/professors');
const mentorRoute = require('./routes/mentor');


const mysql = require('mysql');
const app = express();
const PORT = 3000;
const db = require('./db');
global.db = db;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("frontend"));
app.use('/api', loginRoute);
app.use('/api/fees', feesRoute);
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/exam', require('./routes/exam'));
app.use('/api/exam', examRoutes);
app.use('/fees', express.static(path.join(__dirname, 'fees')));
app.use( professorsRoutes); 
app.use('/api/mentor', mentorRoute);



// Serve static frontend files from each module folder
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/login')));
app.use(express.static(path.join(__dirname, '../frontend/dashboard')));
app.use(express.static(path.join(__dirname, '../frontend/attendance')));
app.use(express.static(path.join(__dirname, '../frontend/timetable')));
app.use(express.static(path.join(__dirname, '../frontend/fees')));
app.use(express.static(path.join(__dirname, '../frontend/exam')));
app.use(express.static(path.join(__dirname, '../frontend/professor')));
app.use(express.static(path.join(__dirname, '../frontend/mentor')));

app.use('/assets', express.static(path.join(__dirname, 'assets')));



// Serve login page at root

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login/login.html'));
});
app.get('/attendance', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/attendance/attendance.html'));
});
app.get('/fees', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/fees/fees.html'));
});

app.get('/exam-timetable', (req, res) => {
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




app.get('/api/mentor', (req, res) => {
  const userid = req.query.userid;

  const query = `
 SELECT m.name, m.department, m.email, m.contact, m.cabin_no
FROM students AS s
JOIN mentor AS m ON s.mentor_id = m.userid
WHERE s.userid = ?


  `;

  db.query(query, [userid], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.json(results[0]);
  });
});

app.get('/api/notices', async (req, res) => {
    const userid = req.query.userid;
    try {
        const [rows] = await db.query(`
            SELECT title, description, date FROM notices
            WHERE department = (SELECT department FROM student WHERE userid = ?)
            ORDER BY date DESC
        `, [userid]);

        // Remove duplicate notices by 'title + description'
        const uniqueMap = new Map();
        rows.forEach(row => {
            const key = `${row.title}-${row.description}`;
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, row);
            }
        });

        const uniqueNotices = Array.from(uniqueMap.values());

        res.json(uniqueNotices);
    } catch (err) {
        console.error('Error fetching notices:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// ✅ Import and use route files
app.use('/login', require('./routes/login'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/attendance', require('./routes/attendance'));
app.use('/timetable', require('./routes/timetable'));
app.use('/fees', require('./routes/fees'));
app.use('/exam', require('./routes/exam'));
app.use('/professor', require('./routes/professors'));
app.use('/mentor', require('./routes/mentor'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 