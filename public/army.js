const express = require('express');
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
// GET-Route: Zeigt den Inhalt (die Zusammensetzung) einer Armee an
router.get('/', isAuthenticated, (req, res) => {
    const { armyId } = req.query;
    if (!armyId) {
        return res.status(400).send("Fehlende Army-ID.");
    }
    const db = new sqlite3.Database('backend/database.db', (err) => {
        if (err) {
            console.error("Fehler beim Öffnen der Datenbank:", err.message);
        } else {
            console.log("Mit SQLite-Datenbank verbunden.");
        }
    });
    const sql = `SELECT * FROM ArmeeComposition WHERE ID_Army = ?`;
    db.all(sql, [armyId], (err, rows) => {
        if (err) {
            console.error("Fehler beim Abrufen der Armee-Zusammenstellung:", err.message);
            return res.status(500).send("Fehler beim Abrufen der Armee-Zusammenstellung.");
        }
        let html = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Armee Inhalt anzeigen</title>
            <link rel="stylesheet" href="/master.css">
        </head>
        <body>
            <div id="nav-placeholder"></div>
            <div class="container">
                <h2>Armee Inhalt</h2>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Army ID</th>
                            <th>Fraktion</th>
                            <th>Name</th>
                            <th>Troop Data</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        if (rows.length === 0) {
            html += `<tr><td colspan="5">Keine Einheiten gefunden.</td></tr>`;
        } else {
            rows.forEach((row) => {
                html += `
                        <tr>
                            <td>${row.ID_ArmeeComposition}</td>
                            <td>${row.ID_Army}</td>
                            <td>${row.Fraction}</td>
                            <td>${row.Name}</td>
                            <td>${row.TroopData}</td>
                        </tr>
                `;
            });
        }
        html += `
                    </tbody>
                </table>
                <a href="/"><button>Zurück</button></a>
            </div>
            <script src="/navigation.js"></script>
        </body>
        </html>
        `;
        res.send(html);
    });
});

module.exports = router;
