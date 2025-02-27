const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Middleware zum Parsen von Formulardaten
app.use(express.urlencoded({ extended: true }));

// Statische Dateien bereitstellen
app.use(express.static('public'));

// Importiere die Routen
const registerRouter = require('./backend/register.js');
const tournamentList = require('./backend/tournamentList.js');
const tournamentCreate = require('./backend/tournamentCreate.js');

// Nutze die Routen
app.use('/register', registerRouter);
app.use('/tournamentList', tournamentList);
app.use('/create-tournament', tournamentCreate);

// Falls du noch andere Routen hast, kannst du sie hier einbinden
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});