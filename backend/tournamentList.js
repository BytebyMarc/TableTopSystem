const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Verbindung zur SQLite-Datenbank herstellen oder importieren, falls zentral verwaltet
const db = new sqlite3.Database('backend/database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    }
});

// Route für die Anzeige der Turnierliste
router.get('/tournamentList', (req, res) => {
    db.all(`SELECT * FROM Tournament`, (err, rows) => {
        if (err) {
            console.error("Fehler beim Abrufen der Turniere:", err.message);
            return res.status(500).send("Fehler beim Abrufen der Turniere.");
        }

        let html = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Tournament Liste</title>
    <link rel="stylesheet" href="/master.css">
</head>
<body>
    <div id="nav-placeholder"></div>
    <div class="main-content">
        <h2>Tournament Liste</h2>
        <div class="tournament-container">
    `;

        rows.forEach((tournament) => {
            html += `
            <div class="tournament-card">
                <h3>${tournament.Name}</h3>
                <p><strong>Ort:</strong> ${tournament.Ort}</p>
                <p><strong>Preis:</strong> ${tournament.Price}€</p>
                <p><strong>Start:</strong> ${tournament.Start}</p>
                <p><strong>Ende:</strong> ${tournament.End}</p>
                <a href="/tournament-details?id=${tournament.ID_Tournament}">Details ansehen</a>
            </div>
      `;
        });

        html += `
        </div>
    </div>
    <script src="/navigation.js"></script>
</body>
</html>
    `;

        res.send(html);
    });
});

module.exports = router;