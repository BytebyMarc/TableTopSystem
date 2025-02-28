const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('backend/database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    } else {
        console.log("Mit SQLite-Datenbank verbunden.");
    }
});

// GET-Route: Registrierungsformular anzeigen
router.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <title>Registrierung</title>
        <link rel="stylesheet" href="master.css">
    </head>
    <body>
    <div id="nav-placeholder"></div>
    <div class="container">
        <h2>Registrierung</h2>
        <form action="/register" method="post">
            <label for="email">E-Mail:</label>
            <input type="email" id="email" name="email" required>
    
            <label for="password">Passwort:</label>
            <input type="password" id="password" name="password" required>
    
            <label for="confirm_password">Passwort bestätigen:</label>
            <input type="password" id="confirm_password" name="confirm_password" required>
    
            <input type="submit" value="Registrieren">
        </form>
    </div>
    <script src="navigation.js"></script>
    </body>
    </html>
    `;
    res.send(html);
});

// POST-Route: Registrierung verarbeiten
router.post('/', async (req, res) => {
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
