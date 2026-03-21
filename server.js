const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Store connected users: socketId -> username
const users = {};

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado:', socket.id);

  socket.on('join', (username) => {
    users[socket.id] = username;
    console.log(`\${username} se ha unido con ID \${socket.id}`);
  });

  socket.on('chat message', (msg) => {
    console.log('Mensaje de ' + (users[socket.id] || 'Anónimo') + ': ' + msg.text);

    // In a real app, we'd use msg.to for private messages.
    // For this prototype, we'll keep broadcasting but including the sender.
    io.emit('chat message', {
        ...msg,
        user: users[socket.id] || msg.user
    });

    // Respuesta automática de Gohan (solo si el mensaje no es de Gohan)
    if (users[socket.id] !== 'Gohan' && msg.user !== 'Gohan') {
      setTimeout(() => {
          const reply = {
              user: 'Gohan',
              text: `¡Hola \${users[socket.id] || 'amigo'}! Soy Gohan. Recibí tu mensaje: "\${msg.text}"`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isBot: true
          };
          io.emit('chat message', reply);
      }, 1500);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', users[socket.id]);
    delete users[socket.id];
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Whats Gohan plus funcionando en el puerto \${PORT}`);
});
