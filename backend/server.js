// Simple Socket.IO server for collaborative board
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store board state in memory (for demo only)
const boards = {};

io.on('connection', (socket) => {
  let currentBoard = null;

  socket.on('join-board', (boardId) => {
    if (currentBoard) socket.leave(currentBoard);
    currentBoard = boardId;
    socket.join(boardId);
    // Send current board state to the new user
    if (boards[boardId]) {
      socket.emit('board-state', boards[boardId]);
    }
  });

  socket.on('board-update', ({ boardId, data }) => {
    boards[boardId] = data;
    socket.to(boardId).emit('board-update', data);
  });

  socket.on('disconnect', () => {
    if (currentBoard) socket.leave(currentBoard);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 