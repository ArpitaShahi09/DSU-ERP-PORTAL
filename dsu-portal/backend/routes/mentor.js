const express = require('express');
const router = express.Router();
const db = require('../db');

// Route: /api/mentor?userid=ENG001
router.get('/', (req, res) => {
    const { userid } = req.query;

    if (!userid) {
        return res.status(400).json({ error: 'userid is required' });
    }

    const sql = 'SELECT * FROM mentor WHERE mentor_id = ?';

    db.query(sql, [userid], (err, result) => {
        if (err) {
            console.error('Error fetching mentor data:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Mentor not found' });
        }

        res.json(result[0]);
    });
});

module.exports = router;
