const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Verbindung zur SQLite-Datenbank herstellen oder importieren, falls du sie zentral verwaltest
const db = new sqlite3.Database('backend/database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    } else {
        console.log("Mit SQLite-Datenbank verbunden.");
    }
});

// Route für die Registrierung
router.post('/register', async (req, res) => {
    const { email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send("Passwörter stimmen nicht überein.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(`INSERT INTO Users (eMail) VALUES (?)`, [email], function(err) {
            if (err) {
                console.error("Fehler beim Einfügen in Users:", err.message);
                return res.status(500).send("Registrierung fehlgeschlagen.");
            }

            const userId = this.lastID;

            db.run(`INSERT INTO Passwort (ID_Users, Passwort) VALUES (?, ?)`, [userId, hashedPassword], function(err) {
                if (err) {
                    console.error("Fehler beim Einfügen in Passwort:", err.message);
                    return res.status(500).send("Registrierung fehlgeschlagen.");
                }
                res.send("Registrierung erfolgreich!");
            });
        });
    } catch (error) {
        console.error("Serverfehler:", error);
        res.status(500).send("Serverfehler.");
    }
});

module.exports = router;
