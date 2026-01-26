const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Inicializar la base de datos y crear la tabla si no existe
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS consultas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        edad INTEGER,
        sexo TEXT,
        otros_datos TEXT,
        lat REAL,
        lng REAL,
        resumen TEXT,
        diagnostico TEXT,
        clasificacion TEXT,
        fecha TEXT,
        form_data TEXT
      )
    `);
    db.run(`ALTER TABLE consultas ADD COLUMN form_data TEXT`, (err) => {
      if (err && err.message.includes('duplicate column name')) {
        console.log('Column form_data already exists.');
      } else if (err) {
        console.error('Error adding column:', err.message);
      }
    });
  }
});

// Endpoint para guardar un diagnóstico
app.post('/diagnostico', (req, res) => {
  const { nombre, edad, sexo, otros_datos, lat, lng, resumen, diagnostico, clasificacion } = req.body;
  const fecha = new Date().toISOString();
  db.run(
    `INSERT INTO consultas (nombre, edad, sexo, otros_datos, lat, lng, resumen, diagnostico, clasificacion, fecha, form_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [nombre, edad, sexo, otros_datos, lat, lng, resumen, diagnostico, clasificacion, fecha, JSON.stringify(req.body)],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al guardar el diagnóstico' });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// Endpoint para obtener todos los registros
app.get('/consultas', (req, res) => {
  db.all('SELECT * FROM consultas', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener los registros' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});