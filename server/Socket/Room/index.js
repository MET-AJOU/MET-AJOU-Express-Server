import { defaultKeyBoardState } from '../constant.js';
import { getJoinedUsersState } from '../util.js';

export const joinRoom =
  ({ socket, io, SocketMap, UserIdToRoom, UsersState }) =>
  ({ roomId, userId }) => {
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
  };

export const disconnect =
  ({ SocketMap, UserIdToRoom, UsersState }) =>
  () => {
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
