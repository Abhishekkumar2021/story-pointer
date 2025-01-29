import { io, Socket } from 'socket.io-client';

interface User {
  username: string;
  points: number;
  showPoints: true
}

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    
    socket = io(import.meta.env.VITE_SERVER_URL);
  }
  return socket;
};

export const joinSession = (sessionId: string, username: string) => {
  
  getSocket().emit('joinSession', { sessionId, username });
};

export const rejoinSession = (sessionId: string, username: string) => {
  
  getSocket().emit('rejoinSession', { sessionId, username });
};

export const leaveSession = (sessionId: string, username: string) => {
  
  getSocket().emit('leaveSession', { sessionId, username });
};

export const updatePoints = (sessionId: string, username: string, points: number) => {
  
  getSocket().emit('updatePoints', { sessionId, username, points });
};

export const toggleShowPoints = (sessionId: string, username: string) => {
  
  getSocket().emit('toggleShowPoints', { sessionId, username });
};

export const onShowPointsToggled = (callback: (data: { username: string; showPoints: boolean }) => void) => {
  
  getSocket().on('showPointsToggled', callback);
};

export const onUserJoined = (callback: (data: User) => void) => {
  
  getSocket().on('userJoined', callback);
};

export const onUserRejoined = (callback: (data: User) => void) => {
  
  getSocket().on('userRejoined', callback);
};

export const onUserLeft = (callback: (data: { username: string }) => void) => {
  
  getSocket().on('userLeft', callback);
};

export const onPointsUpdated = (callback: (data: User) => void) => {
  
  getSocket().on('pointsUpdated', callback);
};

export const onError = (callback: (error: { error: string }) => void) => {
  
  getSocket().on('error', callback);
};