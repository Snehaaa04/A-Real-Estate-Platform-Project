import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { Server } from 'socket.io';
import setupSockets from './sockets/socketHandlers';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
console.log('App is:', typeof app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupSockets(io);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export { io };
