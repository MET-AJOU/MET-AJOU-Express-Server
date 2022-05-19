import {
  getJoinedUsersState,
  getUserState,
  removeUser
} from './util.js';

import {
  defaultKeyBoardState
} from './constant.js';

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

export const initSocketEvents = ({
  io,
  socket
}) => {
  socket.on('join', ({
    roomId,
    userId
  }) => {
    let _userId = UsersState.size + 1;
    SocketMap.set(socket.id, userId);
    UserIdToRoom.set(_userId, roomId);
    io.in(roomId).emit('joinNewUser', {
      userId: _userId,
      characterId: 1,
      position: {
        x: 1,
        y: 7 + _userId,
        z: 1,
      },
      keyState: defaultKeyBoardState,
    });

    UsersState.set(_userId, {
      userId: _userId,
      position: {
        x: 1,
        y: 7 + _userId,
        z: 1,
      },
      characterId: 1,
      keyState: defaultKeyBoardState,
    });

    const joinedUsers = getJoinedUsersState(UsersState, UserIdToRoom, roomId);
    console.log(joinedUsers);
    io.to(socket.id).emit('getUserId', _userId);
    io.to(socket.id).emit('joinRoom', joinedUsers);
    socket.join(roomId);
  });

  socket.on('chat', ({
    userId,
    message,
    position
  }) => {
    const roomId = getJoinRoom(userId);
    io.in(roomId).emit('chat', {
      userId,
      message,
      position,
    });
  });

  socket.on('keyDown', ({
    userId,
    keyState,
    position
  }) => {
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

  socket.on('keyUp', ({
    userId,
    keyState,
    position
  }) => {
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

  socket.on('disconnect', () => {
    const leaveUserId = SocketMap.get(socket.id);
    console.log("leaver User Id", leaveUserId);
    const leaveRoomId = UserIdToRoom.get(leaveUserId);
    removeUser(leaveUserId, UserIdToRoom, UsersState, SocketMap);
    const joinedUsers = getJoinedUsersState(UsersState, UserIdToRoom, leaveRoomId);
    io.in(leaveRoomId).emit('leaveUser', joinedUsers);

  })
};