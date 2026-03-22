const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Manejo de errores 404
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Api Gohan funcionando en el puerto ${PORT}`);
});
