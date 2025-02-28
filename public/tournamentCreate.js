const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();
const req = require("express/lib/request");
const isAuthenticated = require('../middleware/isAuthenticated');

// Verbindung zur SQLite-Datenbank herstellen oder importieren, falls zentral verwaltet
const db = new sqlite3.Database('backend/database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    }
});
//ID_Users = req.session.userId;
// GET-Route: HTML-Formular anzeigen
router.get('/', isAuthenticated, (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Registrierung</title>
            <link rel="stylesheet" href="master.css">
        </head>
        <body>
            <div id="nav-placeholder"></div>
            <div class="main-content">
                <div class="tournament-card">
                    <h2>Neues Turnier anlegen</h2>
                    <form action="/create-tournament" method="post">
                        <!-- Hidden-Feld für Benutzer-ID -->
                        <input type="hidden" name="ID_Users" value="1">
                        
                        <div class="tournament-form-group">
                            <label for="name">Turniername:</label>
                            <input type="text" id="name" name="Name" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="maxSubscriber">Maximale Teilnehmer:</label>
                            <input type="number" id="maxSubscriber" name="MaxSubscriber" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="plz">PLZ:</label>
                            <input type="number" id="plz" name="PLZ" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="ort">Ort:</label>
                            <input type="text" id="ort" name="Ort" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="price">Preis:</label>
                            <input type="number" id="price" name="Price" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="lastDate">Anmeldeschluss:</label>
                            <input type="datetime-local" id="lastDate" name="LastDate" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="maxPoint">Maximale Punkte:</label>
                            <input type="number" id="maxPoint" name="MaxPoint" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="start">Turnierbeginn:</label>
                            <input type="datetime-local" id="start" name="Start" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="end">Turnierende:</label>
                            <input type="datetime-local" id="end" name="End" required>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="information">Informationen:</label>
                            <textarea id="information" name="Information" required></textarea>
                        </div>
                        
                        <div class="tournament-form-group">
                            <label for="paypal">Paypal:</label>
                            <input type="text" id="paypal" name="Paypal" required>
                        </div>
                        
                        <input type="submit" value="Turnier anlegen">
                    </form>
                </div>
            </div>
            <script src="navigation.js"></script>
        </body>
        </html>
    `);
});

// POST-Route: Turnier erstellen
router.post('/', (req, res) => {
    const { ID_Users, Name, MaxSubscriber, PLZ, Ort, Price, LastDate, MaxPoint, Start, End, Information, Paypal } = req.body;

    const sql = `
        INSERT INTO Tournament 
          (ID_Users, Name, MaxSubscriber, PLZ, Ort, Price, LastDate, MaxPoint, Start, End, Information, Paypal)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [ID_Users, Name, MaxSubscriber, PLZ, Ort, Price, LastDate, MaxPoint, Start, End, Information, Paypal], function(err) {
        if (err) {
            console.error("Fehler beim Erstellen des Turniers:", err.message);
            return res.status(500).send("Turniererstellung fehlgeschlagen.");
        }
        res.redirect('/tournamentList');
    });
});

module.exports = router;
