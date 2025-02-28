const express = require('express');
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('backend/database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    } else {
        console.log("Mit SQLite-Datenbank verbunden.");
    }
});

// GET-Route: Zeigt alle Armeelisten an
router.get('/',isAuthenticated, (req, res) => {
    const sql = `SELECT * FROM ArmyList WHERE ID_Users = ${req.session.userId}`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Fehler bei der Abfrage der Armeelisten:", err.message);
            return res.status(500).send("Fehler beim Abrufen der Armeelisten.");
        }

        // HTML-Seite mit einer Tabelle, in der die Armeelisten angezeigt werden
        let html = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Armeelisten</title>
            <link rel="stylesheet" href="master.css">
        </head>
        <body>
            <div id="nav-placeholder"></div>
            <div class="container">
                <h2>Armeelisten</h2>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Benutzer-ID</th>
                            <th>Name der Armee</th>
                            <th>Spielsystem</th>
                            <th>Punkte</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        rows.forEach((row) => {
            html += `
                                <tr>
            <td>${row.ID_Army}</td>
            <td>${row.ID_Users}</td>
            <td>${row.Name}</td>
            <td>${row.ID_GameSystem}</td>
            <td>${row.Points}</td>
            <td>
                 <a href="/armyComposition?armyId=${row.ID_Army}">
                                    <button>Einheiten hinzufügen</button>
                                </a>
                                <a href="/army?armyId=${row.ID_Army}">
                                    <button>Armee anzeigen</button>
                                </a>
            </td>
        </tr>
            `;
        });
        html += `
                    </tbody>
                </table>
            </div>
            <script src="navigation.js"></script>
        </body>
        </html>
        `;
        res.send(html);
    });
});

module.exports = router;
