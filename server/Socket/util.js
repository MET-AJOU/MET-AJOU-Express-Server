export const UserIdToRoom = new Map();

export const getJoinRoom = (userId) => UserIdToRoom.get(userId);

export const printConnection = (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('socket 연결 성공 ip : ', ip);
    console.log('socket id : ', socket.id);
};

export const joinRoom = ({ roomId, userId }) => {
    UserIdToRoom.set(userId, roomId);
    this.join(roomId);
    this.to(roomId).emit('join', {
        characterId: 1,
        position: { x: 1, y: 7, z: 1 },
    });
};

export const chat = ({ userId, message, position }) => {
    const roomId = getJoinRoom(userId);
    this.to(roomId).emit('chat', {
        userId,
        message,
        position,
    });
};

export const keyUp = ({ userId, key, position }) => {
    const roomId = getJoinRoom(userId);
    this.to(roomId).emit('keyUp', { userId, key, position });
};

export const keyDown = ({ userId, key, position }) => {
    const roomId = getJoinRoom(userId);
    this.to(roomId).emit('keyDown', { userId, key, position });
};