import { Server } from 'socket.io';
import { corsOption } from '../Common/Constant/index.js';
import { printConnection } from './util.js';
export const socketInit = (server, app) => {
    console.log(corsOption);
    const io = new Server(server, { cors: corsOption });
    io.on('connection', (socket) => {
        printConnection(socket);
    });
};