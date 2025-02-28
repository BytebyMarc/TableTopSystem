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

// GET-Route: Loginformular anzeigen
router.get('/', (req, res) => {
    const loginForm = `
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
            <form action="/login" method="post">
                <label for="email">E-Mail:</label>
                <input type="email" id="email" name="email" required>
    
                <label for="password">Passwort:</label>
                <input type="password" id="password" name="password" required>
    
                <input type="submit" value="Login">
            </form>
        </div>
        <script src="navigation.js"></script>
    </body>
    </html>
    `;
    res.send(loginForm);
});

// POST-Route: Login-Daten verarbeiten
router.post('/', (req, res) => {
    const { email, password } = req.body;

    // Abfrage des Benutzers anhand der E-Mail-Adresse
    const sql = `
        SELECT Users.ID_Users, Passwort.Passwort 
        FROM Users 
        JOIN Passwort ON Users.ID_Users = Passwort.ID_Users 
        WHERE Users.eMail = ?
    `;
    db.get(sql, [email], async (err, row) => {
        if (err) {
            console.error("Fehler bei der Datenbankabfrage:", err.message);
            return res.status(500).send("Serverfehler.");
        }

        if (!row) {
            return res.status(401).send("Ungültige E-Mail oder Passwort.");
        }

        try {
            // Vergleich des eingegebenen Passworts mit dem gespeicherten Hash
            const match = await bcrypt.compare(password, row.Passwort);
            if (match) {
                req.session.userId = row.ID_Users;
                console.log("login");
                console.log(req.session.userId);
                res.redirect('/');
                //res.send("Login erfolgreich!");
            } else {
                res.status(401).send("Ungültige E-Mail oder Passwort.");
            }
        } catch (error) {
            console.error("Fehler bei der Passwortüberprüfung:", error);
            res.status(500).send("Serverfehler.");
        }
    });
});

module.exports = router;
