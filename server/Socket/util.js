export const getJoinedUsersState = (UsersState, UserIdToRoom, roomId) =>
  Array.from(UsersState.entries()).reduce((acc, [userId, userState]) => {
    return roomId === UserIdToRoom.get(userId) ? [...acc, userState] : acc;
  }, []);

export const removeUser = (userId, UserIdToRoom, UsersState, SocketMap) => {
  UserIdToRoom.delete(userId);
  UsersState.delete(userId);
  SocketMap.delete(userId);
};
