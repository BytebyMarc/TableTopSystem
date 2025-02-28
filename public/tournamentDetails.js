const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Optional: Middleware einbinden, falls du den Zugriff schützen möchtest
// const isAuthenticated = require('../middleware/isAuthenticated');

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('backend/database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    } else {
        console.log("Mit SQLite-Datenbank verbunden.");
    }
});

// GET-Route: Turnier-Details anzeigen
// Falls du den Zugriff schützen möchtest, füge 'isAuthenticated' als Parameter hinzu
router.get('/', /* isAuthenticated, */ (req, res) => {
    const tournamentId = req.query.id;
    const sql = `SELECT * FROM Tournament WHERE ID_Tournament = ?`;

    db.get(sql, [tournamentId], (err, row) => {
        if (err) {
            console.error("Fehler bei der Abfrage:", err.message);
            return res.status(500).send("Serverfehler.");
        }
        if (!row) {
            return res.status(404).send("Turnier nicht gefunden.");
        }

        // HTML-Seite zum Anzeigen der Turnier-Details
        const html = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Turnier Details</title>
            <link rel="stylesheet" href="/master.css">
        </head>
        <body>
            <div id="nav-placeholder"></div>
            <div class="container">
                <h2>Turnier Details</h2>
                <table border="1">
                    <tr>
                        <th>ID_Tournament</th>
                        <td>${row.ID_Tournament}</td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td>${row.Name}</td>
                    </tr>
                    <tr>
                        <th>Max. Teilnehmer</th>
                        <td>${row.MaxSubscriber}</td>
                    </tr>
                    <tr>
                        <th>PLZ</th>
                        <td>${row.PLZ}</td>
                    </tr>
                    <tr>
                        <th>Ort</th>
                        <td>${row.Ort}</td>
                    </tr>
                    <tr>
                        <th>Preis</th>
                        <td>${row.Price}</td>
                    </tr>
                    <tr>
                        <th>Last Date</th>
                        <td>${row.LastDate}</td>
                    </tr>
                    <tr>
                        <th>Max. Punkte</th>
                        <td>${row.MaxPoint}</td>
                    </tr>
                    <tr>
                        <th>Start</th>
                        <td>${row.Start}</td>
                    </tr>
                    <tr>
                        <th>Ende</th>
                        <td>${row.End}</td>
                    </tr>
                    <tr>
                        <th>Information</th>
                        <td>${row.Information}</td>
                    </tr>
                    <tr>
                        <th>Paypal</th>
                        <td>${row.Paypal}</td>
                    </tr>
                    <tr>
                        <th>Erstellt am</th>
                        <td>${row.DateInsertEntry}</td>
                    </tr>
                </table>
            </div>
            <script src="/navigation.js"></script>
        </body>
        </html>
        `;
        res.send(html);
    });
});

module.exports = router;
