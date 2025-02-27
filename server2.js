const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

// Middleware zum Parsen von Formulardaten (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Statische Dateien aus dem Ordner "public" bereitstellen
app.use(express.static('public'));

// Verbindung zur SQLite-Datenbank (Datei "database.db", wird bei Bedarf erstellt)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    } else {
        console.log("Mit SQLite-Datenbank verbunden.");
        db.run(`CREATE TABLE IF NOT EXISTS Users (
                                                     ID_Users INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     eMail VARCHAR(50) NOT NULL,
                                                     DateInsertEntry DATETIME DEFAULT CURRENT_TIMESTAMP
                )`);
        db.run(`CREATE TABLE IF NOT EXISTS Passwort(
                                                       ID_Passwort INTEGER PRIMARY KEY AUTOINCREMENT,
                                                       ID_Users INTEGER,
                                                       Passwort VARCHAR(255) NOT NULL,
                                                       DateLastUpdate DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                       FOREIGN KEY (ID_Users) REFERENCES Users(ID_Users)
                )`);
    }
});

// Route für die Registrierung
app.post('/register', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
