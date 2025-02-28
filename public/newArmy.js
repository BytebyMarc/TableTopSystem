const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const isAuthenticated = require('../middleware/isAuthenticated');
const req = require("express/lib/request");
// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('backend/database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    } else {
        console.log("Mit SQLite-Datenbank verbunden.");
    }
});
// ID_Users = req.session.userId;
// GET-Route: Formular anzeigen
router.get('/',isAuthenticated, (req, res) => {
    const formHtml = `
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
            <h2>New Army</h2>
            <form action="/newArmy" method="post">
                <!-- Falls die Benutzer-ID aus der Session stammt, als Hidden-Feld -->
                    
                <label for="name">Name der Armee:</label>
                <input type="text" id="name" name="Name" placeholder="Armee-Name" required>
    
                <label for="id_gamesystem">Spielsystem:</label>
                <input type="text" id="id_gamesystem" name="ID_GameSystem" placeholder="Spielsystem ID" required>
    
                <label for="points">Punkte:</label>
                <input type="number" id="points" name="Points" placeholder="Punkte" required>
    
                <input type="submit" value="Armeeliste erstellen">
            </form>
        </div>
        <script src="navigation.js"></script>
    </body>
    </html>
    `;
    res.send(formHtml);
});

// POST-Route: Formulardaten verarbeiten und in die Datenbank einfügen
router.post('/', (req, res) => {
    const { ID_Users, Name, ID_GameSystem, Points } = req.body;

    // Überprüfen, ob alle Felder ausgefüllt sind
    if (!ID_Users || !Name || !ID_GameSystem || !Points) {
        return res.status(400).send("Alle Felder müssen ausgefüllt sein.");
    }

    const sql = `INSERT INTO ArmyList (ID_Users, Name, ID_GameSystem, Points) VALUES (?, ?, ?, ?)`;
    db.run(sql, [ID_Users, Name, ID_GameSystem, Points], function(err) {
        if (err) {
            console.error("Fehler beim Einfügen in ArmyList:", err.message);
            return res.status(500).send("Fehler beim Erstellen der Armeeliste.");
        }
        res.send("Armeeliste erfolgreich erstellt!");
    });
});

module.exports = router;
