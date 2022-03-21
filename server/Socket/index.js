import { Server } from 'socket.io';

export const socketInit = (server, app) => {
    const io = new Server(server);
    io.on('connection', () => {
        console.log(123);
    });
};