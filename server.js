// Szükséges csomagok betöltése
const express = require('express'); // Express keretrendszer betöltése (HTTP szerverhez)
const axios = require('axios');     // Axios betöltése (külső API-k eléréséhez)

// Express alkalmazás létrehozása
const app = express();
const PORT = 3000; // A szerver ezen a porton fog futni

// JSON feldolgozás engedélyezése (POST, PUT kérésben a body-t tudjuk használni)
app.use(express.json());

// ========== FŐOLDAL VÉGPONT ==========
app.get('/', function (req, res) {
  // Amikor a böngésző a főoldalt kéri (pl. http://localhost:3000), ez a szöveg jelenik meg
  res.send('A server fut');
});

// ========== GET /users ==========
app.get('/users', function (req, res) {
  // Külső API hívás: Lekérjük az összes felhasználót a JSONPlaceholder nevű teszt API-ról
  axios.get('https://jsonplaceholder.typicode.com/users')
    .then(function (response) {
      // Ha sikerül lekérni, visszaküldjük az adatokat JSON formátumban
      res.json(response.data);
    })
    .catch(function (error) {
      // Ha hiba történik, 500-as hibakódot küldünk vissza
      res.status(500).json({ error: 'Hiba történt a külső API elérésekor.' });
    });
});

// ========== POST /users ==========
app.post('/users', function (req, res) {
  // Az új felhasználó adatai a kérés body részében vannak
  const ujUser = req.body;

  // Ellenőrizzük, hogy minden szükséges adat meg van-e adva
  if (!ujUser.id || !ujUser.name || !ujUser.email) {
    res.status(400).json({ error: 'Hiányzik az id, name vagy email mező.' });
    return; // Kilépünk a függvényből, hogy ne folytassa tovább
  }

  // Külső API hívás: elküldjük az új felhasználót a JSONPlaceholder API-nak
  axios.post('https://jsonplaceholder.typicode.com/users', ujUser)
    .then(function (response) {
      // Sikeres mentés esetén visszaküldjük az új adatot és 201-es státuszkódot (létrehozva)
      res.status(201).json(response.data);
    })
    .catch(function (error) {
      // Hiba esetén 500-as státuszkódot küldünk
      res.status(500).json({ error: 'Nem sikerült új felhasználót hozzáadni.' });
    });
});

// ========== PUT /users/:id ==========
app.put('/users/:id', function (req, res) {
  // Az URL-ben lévő azonosító (pl. /users/3 -> id = 3)
  const id = req.params.id;
  // A módosított adatok a body-ban érkeznek
  const modositas = req.body;

  // Külső API hívás: frissítjük a felhasználót a megadott ID alapján
  axios.put('https://jsonplaceholder.typicode.com/users/' + id, modositas)
    .then(function (response) {
      // Ha sikeres, visszaküldjük a frissített adatokat
      res.json(response.data);
    })
    .catch(function (error) {
      // Hiba esetén hibát küldünk
      res.status(500).json({ error: 'Nem sikerült a felhasználót módosítani.' });
    });
});

// ========== DELETE /users/:id ==========
app.delete('/users/:id', function (req, res) {
  // Az URL-ben megadott felhasználó azonosító
  const id = req.params.id;

  // Külső API hívás: töröljük a megadott ID-jű felhasználót
  axios.delete('https://jsonplaceholder.typicode.com/users/' + id)
    .then(function () {
      // Ha sikeres a törlés, visszajelzést küldünk
      res.json({ message: 'Felhasználó törölve: ' + id });
    })
    .catch(function (error) {
      // Hiba esetén hibát küldünk
      res.status(500).json({ error: 'Nem sikerült törölni a felhasználót.' });
    });
});

// ========== SZERVER INDÍTÁSA ==========
app.listen(PORT, function () {
  // Ez a kódrész akkor fut le, amikor a szerver elindult
  console.log('Szerver fut a http://localhost:' + PORT + ' címen');
});
