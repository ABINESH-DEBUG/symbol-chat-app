const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const symbols = require('./symbols.json');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('joinGroup', group => {
    socket.join(group);
    socket.to(group).emit('userJoined', socket.id);
  });

  socket.on('typing', ({ group, user }) => {
    socket.to(group).emit('typing', user);
  });

  socket.on('message', ({ group, user, text }) => {
    const parsed = parseSymbols(text);
    io.to(group).emit('message', { user, text: parsed });
  });
});

function parseSymbols(text) {
  return text.replace(/:\w+:/g, match => symbols[match] || match);
}

server.listen(3000, () => console.log('Server running on http://localhost:3000'));