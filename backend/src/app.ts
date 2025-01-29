import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import SessionManager from './db/session.db';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL as string],
  },
});

app.use(cors());
app.use(express.json());

const sessionManager = new SessionManager();

app.post('/session', (req: Request, res: Response) => {
  const { sessionName } = req.body;
  try {
    const sessionId = uuidv4();
    sessionManager.createSession(sessionId, sessionName);
    
    res.status(201).json({ message: 'Session created', sessionId });
  } catch (error: any) {
    console.error(`Error creating session: ${error.message}`); // Log error
    res.status(400).json({ error: error.message });
  }
});

app.delete('/session/:sessionId', (req: Request, res: Response) => {
  const { sessionId } = req.params;
  try {
    sessionManager.deleteSession(sessionId);
    
    res.status(200).json({ message: 'Session deleted' });
  } catch (error: any) {
    console.error(`Error deleting session with ID ${sessionId}: ${error.message}`); // Log error
    res.status(400).json({ error: error.message });
  }
});

app.get("/users/:sessionId", (req: Request, res: Response) => {
  const { sessionId } = req.params; // Extract sessionId from URL parameter

  try {
    // Assuming sessionManager.getUsersBySession(sessionId) is a valid function
    const users = sessionManager.getUsersBySession(sessionId);
    if (!users) {
      console.error(`Session not found or no users in session for ID: ${sessionId}`); // Log error
      res.status(404).json({ error: 'Session not found or no users in session' });
      return;
    }
    
    res.status(200).json({ users });
  } catch (error: any) {
    console.error(`Error fetching users for session ID ${sessionId}: ${error.message}`); // Log error
    res.status(400).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  

  socket.on('joinSession', ({ sessionId, username }) => {
    try {
      const user = sessionManager.addUserToSession(sessionId, username, 0);
      socket.join(sessionId);
      io.to(sessionId).emit('userJoined', user);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error(`Error joining session ID ${sessionId}: ${errorMessage}`);
      socket.emit('error', { error: errorMessage });
    }
  });

  socket.on('leaveSession', ({ sessionId, username }) => {
    try {
      sessionManager.removeUserFromSession(sessionId, username);
      socket.leave(sessionId);
      io.to(sessionId).emit('userLeft', { username });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error(`Error leaving session ID ${sessionId}: ${errorMessage}`);
      socket.emit('error', { error: errorMessage });
    }
  });

  socket.on('updatePoints', ({ sessionId, username, points }) => {
    try {
      const updatedUser = sessionManager.updateUserPoints(sessionId, username, points);
      io.to(sessionId).emit('pointsUpdated', updatedUser);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error(`Error updating points in session ID ${sessionId}: ${errorMessage}`);
      socket.emit('error', { error: errorMessage });
    }
  });

  socket.on('toggleShowPoints', ({ sessionId, username }) => {
    try {
      const newStatus = sessionManager.toggleUserShowPoints(sessionId, username);
      io.to(sessionId).emit('showPointsToggled', { username, showPoints: newStatus });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error(`Error toggling showPoints status in session ID ${sessionId}: ${errorMessage}`);
      socket.emit('error', { error: errorMessage });
    }
  });

  socket.on('rejoinSession', ({ sessionId, username }) => {
    try {
      const session = sessionManager.getSession(sessionId);
      if (session) {
        const user = session.users.find(user => user.username === username);
        if (user) {
          socket.join(sessionId);
          io.to(sessionId).emit('userRejoined', user);
          
        } else {
          throw new Error('User not found in session');
        }
      } else {
        throw new Error('Session not found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.error(`Error rejoining session ID ${sessionId}: ${errorMessage}`);
      socket.emit('error', { error: errorMessage });
    }
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started at :${process.env.PORT || 8080}`);
});