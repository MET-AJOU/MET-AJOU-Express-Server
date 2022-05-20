import { UserIdToRoom, UsersState } from '../events.js';
import { getJoinedUsersState } from '../util.js';

const getJoinRoom = (map, key) => map.get(key);
const getUserState = (UsersState, _userId) =>
  [...UsersState.values()].filter(({ userId }) => userId === _userId)[0];

export const makeJoinedUsers = ({ userId, keyState, position }) => {
  const roomId = getJoinRoom(UserIdToRoom, userId);
  const beforeUserState = getUserState(UsersState, userId);
  const changedUserState = {
    ...beforeUserState,
    position,
    keyState,
  };

  UsersState.set(userId, changedUserState);
  return getJoinedUsersState(UsersState, UserIdToRoom, roomId);
};
