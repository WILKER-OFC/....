require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rutas
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/apiRoutes'));

// Ruta base
app.get('/', (req, res) => {
  res.send('Bienvenido a Api Gohan - API Rest de Registro y Verificación');
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en modo ${process.env.NODE_ENV || 'development'} en el puerto ${PORT}`);
});

// Manejo de rechazos de promesas no capturados
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Cerrar servidor y salir del proceso
  // server.close(() => process.exit(1));
});
