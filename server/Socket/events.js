import { getJoinedUsersState, getUserState, removeUser } from './util.js';

import { defaultKeyBoardState } from './constant.js';
import { disconnect, joinRoom } from './Room/index.js';

const SocketMap = new Map();
const UserIdToRoom = new Map();
const UsersState = new Map();

export const getJoinRoom = (userId) => UserIdToRoom.get(userId);

export const printConnection = (socket) => {
  const req = socket.request;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('socket 연결 성공 ip : ', ip);
  console.log('socket id : ', socket.id);
};

export const initSocketEvents = ({ io, socket }) => {
  socket.on(
    'join',
    joinRoom({ socket, io, SocketMap, UserIdToRoom, UsersState }),
  );
  socket.on('disconnect', disconnect({ SocketMap, UserIdToRoom, UsersState }));

  socket.on('chat', ({ userId, message, position }) => {
    const roomId = getJoinRoom(userId);
    io.in(roomId).emit('chat', {
      userId,
      message,
      position,
    });
  });

  socket.on('keyDown', ({ userId, keyState, position }) => {
    const roomId = getJoinRoom(userId);
    const beforeUserState = getUserState(UsersState, userId);
    const changedUserState = {
      ...beforeUserState,
      position,
      keyState,
    };

    UsersState.set(userId, changedUserState);
    const joinedUsers = getJoinedUsersState(UsersState, UserIdToRoom, roomId);
    io.in(roomId).emit('keyDown', joinedUsers);
  });

  socket.on('keyUp', ({ userId, keyState, position }) => {
    const roomId = getJoinRoom(userId);

    const beforeUserState = getUserState(UsersState, userId);
    const changedUserState = {
      ...beforeUserState,
      position,
      keyState,
    };

    UsersState.set(userId, changedUserState);
    const joinedUsers = getJoinedUsersState(UsersState, UserIdToRoom, roomId);
    io.in(roomId).emit('keyUp', joinedUsers);
  });

  // socket.on('sendToServer', sendToServer);
};
