import { SocketMap, UserIdToRoom, UsersState } from '../events.js';
import { getJoinedUsersState } from '../util.js';

export const joinRoom =
  ({ socket, io }) =>
  ({ roomId, userId }) => {
    let _userId = UsersState.size + 1;
    SocketMap.set(socket.id, userId);
    UserIdToRoom.set(_userId, roomId);
    const newData = makeJoinNewUserBody({ userId: _userId });

    io.in(roomId).emit('joinNewUser', newData);
    UsersState.set(_userId, newData);

    const joinedUsers = getJoinedUsersState(UsersState, UserIdToRoom, roomId);
    console.log(joinedUsers);
    io.to(socket.id).emit('getUserId', _userId);
    io.to(socket.id).emit('joinRoom', joinedUsers);
    socket.join(roomId);
  };

export const disconnect = () => {
  const leaveUserId = SocketMap.get(socket.id);
  console.log('leaver User Id', leaveUserId);
  const leaveRoomId = UserIdToRoom.get(leaveUserId);
  removeUser(leaveUserId, UserIdToRoom, UsersState, SocketMap);
  const joinedUsers = getJoinedUsersState(
    UsersState,
    UserIdToRoom,
    leaveRoomId,
  );
  io.in(leaveRoomId).emit('leaveUser', joinedUsers);
};
