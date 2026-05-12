import express from 'express';
import { Server } from 'socket.io';
import Game from '../models/Game.js';

const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a game room
    socket.on('join-game', (gameId) => {
      socket.join(`game:${gameId}`);
      console.log(`User ${socket.id} joined game room: ${gameId}`);
      
      // Notify others in the room
      socket.to(`game:${gameId}`).emit('player-joined', {
        playerId: socket.id,
        timestamp: Date.now()
      });
    });

    // Leave a game room
    socket.on('leave-game', (gameId) => {
      socket.leave(`game:${gameId}`);
      console.log(`User ${socket.id} left game room: ${gameId}`);
      
      // Notify others in the room
      socket.to(`game:${gameId}`).emit('player-left', {
        playerId: socket.id,
        timestamp: Date.now()
      });
    });

    // Multiplayer game events
    socket.on('game-action', (data) => {
      const { gameId, action, payload } = data;
      socket.to(`game:${gameId}`).emit('game-action', {
        playerId: socket.id,
        action,
        payload,
        timestamp: Date.now()
      });
    });

    // Chat in game comments
    socket.on('send-comment', async (data) => {
      const { gameId, text, userId } = data;
      
      try {
        const game = await Game.findById(gameId);
        if (game) {
          io.to(`game:${gameId}`).emit('new-comment', {
            userId,
            text,
            timestamp: Date.now()
          });
        }
      } catch (error) {
        console.error('Error sending comment:', error);
      }
    });

    // Live score updates
    socket.on('score-update', (data) => {
      const { gameId, playerId, score } = data;
      io.to(`game:${gameId}`).emit('score-update', {
        playerId,
        score,
        timestamp: Date.now()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default setupSocketIO;
