const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = require('express')();
  const httpServer = createServer(server);

  // Tu código de Socket.io
  const io = new Server(httpServer, { cors: { origin: '*' } });
  const updateTypes = new Map();

  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('loadUpdateTypes', (types) => {
      for (const [key, value] of Object.entries(types)) {
        updateTypes.set(key, value);
      }
    });

    socket.on('callUpdate', (key, update) => {
      io.emit(updateTypes.get(key), update);
    });
  });

  // Next.js handler
server.use((req, res) => handle(req, res));

  httpServer.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
});