import {
  deleteAnonymous,
  getAnonymous,
  getJoinedUsersState,
  getUserState,
  removeUser,
} from './util.js';
import { defaultKeyBoardState, DefaultPosition } from './constant.js';

const SocketMap = new Map();
const UserIdToRoom = new Map();
const UsersState = new Map();
let anonymous = {};

const getJoinRoom = (map, key) => map.get(key);

export const printConnection = (socket) => {
  const req = socket.request;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('socket 연결 성공 ip : ', ip);
  console.log('socket id : ', socket.id);
};

export const initSocketEvents = ({ io, socket }) => {
  socket.on('join', ({ roomId, userId }) => {
    let _userId = userId;
    console.log(roomId);
    if (!userId) {
      _userId = getAnonymous(anonymous);
      anonymous[_userId] = _userId;
    }
    SocketMap.set(socket.id, _userId);
    UserIdToRoom.set(_userId, roomId);
    const joinTime = Date.now();

    io.in(roomId).emit('joinNewUser', {
      userId: _userId,
      characterId: 1,
      position: DefaultPosition[roomId],
      keyState: defaultKeyBoardState,
      joinTime,
    });

    UsersState.set(_userId, {
      userId: _userId,
      position: DefaultPosition[roomId],
      characterId: 1,
      keyState: defaultKeyBoardState,
      joinTime,
    });

    const joinedUsers = getJoinedUsersState(UsersState, UserIdToRoom, roomId);
    console.log(joinedUsers);

    io.to(socket.id).emit('joinRoom', joinedUsers);
    socket.join(roomId);
    if (!userId) io.to(socket.id).emit('getUserId', _userId);
  });

  socket.on('chat', ({ userId, message, position }) => {
    const roomId = getJoinRoom(UserIdToRoom, userId);
    io.in(roomId).emit('chat', {
      userId,
      message,
      position,
      type: 'chat',
    });
  });

  socket.on('keyDown', ({ userId, keyState, position }) => {
    const roomId = getJoinRoom(UserIdToRoom, userId);
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
    const roomId = getJoinRoom(UserIdToRoom, userId);

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

  socket.on('changeCharacter', ({ userId }) => {
    const roomId = getJoinRoom(UserIdToRoom, userId);
    const joinTime = Date.now();
    console.log(userId, roomId);
    UsersState.set(userId, {
      ...UsersState.get(userId),
      joinTime,
    });
    io.in(roomId).emit('changeCharacter', {
      joinTime,
      userId,
    });
  });

  socket.on('disconnect', () => {
    const leaveUserId = SocketMap.get(socket.id);
    console.log('leaver User Id', leaveUserId);
    const leaveRoomId = UserIdToRoom.get(leaveUserId);
    removeUser(leaveUserId, UserIdToRoom, UsersState, SocketMap);
    const joinUsers = getJoinedUsersState(
      UsersState,
      UserIdToRoom,
      leaveRoomId,
    );
    deleteAnonymous(anonymous, leaveUserId);

    io.in(leaveRoomId).emit('leaveUser', {
      joinUsers,
      leaveUserId,
    });
  });
};
