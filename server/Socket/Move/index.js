import { makeJoinedUsers } from './util.js';

export const keyDown = (props) => {
  const joinedUsers = makeJoinedUsers(props);
  io.in(roomId).emit('keyDown', joinedUsers);
};

export const keyUp = (props) => {
  const joinedUsers = makeJoinedUsers(props);
  io.in(roomId).emit('keyUp', joinedUsers);
};
