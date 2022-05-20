import { disconnect, joinRoom } from './Room/index.js';
import { keyDown, keyUp } from './Move/index.js';
import { chat } from './Chat/index.js';

export const SocketMap = new Map();
export const UserIdToRoom = new Map();
export const UsersState = new Map();

export const printConnection = (socket) => {
  const req = socket.request;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('socket 연결 성공 ip : ', ip);
  console.log('socket id : ', socket.id);
};

export const initSocketEvents = ({ io, socket }) => {
  socket.on('join', joinRoom({ socket, io }));
  socket.on('disconnect', disconnect);

  socket.on('keyDown', keyDown);
  socket.on('keyUp', keyUp);

  socket.on('chat', chat);
};
