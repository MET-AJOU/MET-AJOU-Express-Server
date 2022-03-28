export const UserIdToRoom = new Map();

export const getJoinRoom = (userId) => UserIdToRoom.get(userId);

export const printConnection = (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('socket 연결 성공 ip : ', ip);
    console.log('socket id : ', socket.id);
};

export const initSocketEvents = ({ io, socket }) => {
    socket.on('join', ({ roomId, userId }) => {
        UserIdToRoom.set(userId, roomId);
        socket.join(roomId);
        io.to(roomId).emit('join', {
            characterId: 1,
            position: { x: 1, y: 7, z: 1 },
        });
    });

    socket.on('chat', ({ userId, message, position }) => {
        const roomId = getJoinRoom(userId);
        io.to(roomId).emit('chat', {
            userId,
            message,
            position,
        });
    });

    socket.on('keyUp', ({ userId, key, position }) => {
        const roomId = getJoinRoom(userId);
        io.to(roomId).emit('keyUp', { userId, key, position });
    });

    socket.on('keyDown', ({ userId, key, position }) => {
        const roomId = getJoinRoom(userId);
        io.to(roomId).emit('keyDown', { userId, key, position });
    });
};