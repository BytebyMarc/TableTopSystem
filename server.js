const express = require('express');
const path = require('path');
const app = express();
const port = 3001;
const session = require('express-session');

// Middleware zum Parsen von Formulardaten
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'dein-geheim-schluessel', // wähle einen sicheren, zufälligen Schlüssel
    resave: false,
    saveUninitialized: false
}));
// Statische Dateien bereitstellen
app.use(express.static('public'));

// Importiere die Routen
const registerRouter = require('./backend/register.js');
const newArmy = require('./public/newArmy.js');
const login = require('./public/login.js');
const listArmy = require('./public/listArmy.js');
const tournamentList = require('./public/tournamentList.js');
const tournamentCreate = require('./public/tournamentCreate.js');
const logout = require('./public/logout.js');

// Nutze die Routen
app.use('/register', registerRouter);
app.use('/login', login)
app.use('/newArmy', newArmy);
app.use('/listArmy', listArmy);
app.use('/tournamentList', tournamentList);
app.use('/create-tournament', tournamentCreate);
app.use('/logout', logout);

// Falls du noch andere Routen hast, kannst du sie hier einbinden
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});