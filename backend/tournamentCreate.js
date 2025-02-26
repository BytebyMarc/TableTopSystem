const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Verbindung zur SQLite-Datenbank herstellen oder importieren, falls zentral verwaltet
const db = new sqlite3.Database('backend/database.db', (err) => {
    if (err) {
        console.error("Fehler beim Öffnen der Datenbank:", err.message);
    }
});

// Route für das Erstellen eines Turniers
router.post('/create', (req, res) => {
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
        res.send("Turnier erfolgreich erstellt!");
    });
});
module.exports = router;
