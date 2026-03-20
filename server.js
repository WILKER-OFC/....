const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Sirve los archivos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Si alguien entra a cualquier ruta, lo manda al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Whats Gohan plus funcionando en el puerto \${PORT}`);
});