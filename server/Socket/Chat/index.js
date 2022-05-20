export const chat = ({ userId, message, position }) => {
  const roomId = getJoinRoom(userId);
  io.in(roomId).emit('chat', {
    userId,
    message,
    position,
  });
};
