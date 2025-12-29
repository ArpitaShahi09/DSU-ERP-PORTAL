const express = require('express');
const router = express.Router();
const db = require('../db');
router.get('/api/professors', (req, res) => {
    const userid = req.query.userid;
    console.log("Request received for userid:", userid);

    const sql = `
        SELECT subject_name, name, department, email, contact, cabin_no
        FROM professors
        WHERE userid = ?
    `;

    db.query(sql, [userid], (err, results) => {
        if (err) {
            console.error('SQL Error:', err);  // log full error
            return res.status(500).json({ error: 'Database query failed', details: err });
        }

        res.json(results);
    });
});



module.exports = router;
