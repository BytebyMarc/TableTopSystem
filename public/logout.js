const express = require('express');
const router = express.Router();

// GET-Route für den Logout
router.get('/', (req, res) => {
    // Zerstört die Session
    req.session.destroy(err => {
        if (err) {
            console.error("Fehler beim Logout:", err);
            return res.status(500).send("Logout fehlgeschlagen.");
        }
        // Umleiten zur Login-Seite nach erfolgreichem Logout
        res.redirect('/login');
    });
});

module.exports = router;
