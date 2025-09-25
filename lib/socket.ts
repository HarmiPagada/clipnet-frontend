import { io } from 'socket.io-client';
export const socket = io('http://localhost:5000', {
  transports: ['websocket'],   // ensure no polling fallback
  autoConnect: true            // ensure auto-connect is ON
});