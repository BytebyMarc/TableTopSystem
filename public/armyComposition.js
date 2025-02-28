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

// GET-Route: Zeigt das Formular zum Hinzufügen einer Einheit an
router.get('/', isAuthenticated, (req, res) => {
    // Army-ID wird über den Query-Parameter übergeben (z.B. /addunits?armyId=1)
    const { armyId } = req.query;
    if (!armyId) {
        return res.status(400).send("Fehlende Army-ID.");
    }
    const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <title>Einheit hinzufügen</title>
        <link rel="stylesheet" href="/master.css">
    </head>
    <body>
        <div id="nav-placeholder"></div>
        <div class="container">
            <h2>Einheit hinzufügen</h2>
            <form action="/armyComposition" method="POST">
                <input type="hidden" name="armyId" value="${armyId}">
                <div>
                    <label for="Fraction">Fraktion:</label>
                    <input type="number" id="Fraction" name="Fraction" required>
                </div>
                <div>
                    <label for="Name">Name der Einheit:</label>
                    <input type="text" id="Name" name="Name" required>
                </div>
                <div>
                    <label for="TroopData">Einheiten-Daten:</label>
                    <textarea id="TroopData" name="TroopData" required></textarea>
                </div>
                <button type="submit">Einheit hinzufügen</button>
            </form>
        </div>
        <script src="/navigation.js"></script>
    </body>
    </html>
    `;
    res.send(html);
});

// POST-Route: Verarbeitet das Formular und fügt die Einheit in die ArmeeComposition-Tabelle ein
router.post('/', isAuthenticated, (req, res) => {
    const { armyId, Fraction, Name, TroopData } = req.body;
    if (!armyId || !Fraction || !Name || !TroopData) {
        return res.status(400).send("Alle Felder müssen ausgefüllt werden.");
    }
    const sql = `
        INSERT INTO ArmeeComposition (ID_Army, Fraction, Name, TroopData)
        VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [armyId, Fraction, Name, TroopData], function(err) {
        if (err) {
            console.error("Fehler beim Hinzufügen der Einheit:", err.message);
            return res.status(500).send("Fehler beim Hinzufügen der Einheit.");
        }
        // Nach erfolgreichem Einfügen: Weiterleitung z.B. zur Übersicht oder zurück zur Armee
        res.redirect('/');
    });
});

module.exports = router;
