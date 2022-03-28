import { Server } from 'socket.io';
import { corsOption } from '../Common/Constant/index.js';
import { printConnection, joinRoom, chat, keyUp, keyDown } from './util.js';

export const socketInit = (server, app) => {
    console.log(corsOption);
    const io = new Server(server, { cors: corsOption });
    io.on('connection', (socket) => {
        printConnection(socket);
        socket.on('join', joinRoom);
        socket.on('chat', chat);
        socket.on('keyUp', keyUp);
        socket.on('keyDown', keyDown);
    });
};

/*
 socket 이벤트 
----  
eventName : "join" 
Input : (roomId,userName or userId)
Output : { characterId {number}, Position {x,y,z} }
----
eventName : "keyDown" (애니메이션 포함?) => broadcast
Input : userName or userId, key, Position 
Output : useName or userId, key, Position 
---- 
eventName : "keyUp" (애니메이션 포함?) => broadcast 
Input : userName or userId, key, Position 
Output : useName or userId, key, Position 

---
eventName : "chat"
Input : userName or userId, message , Position
Output : userName or userId, message, Position
----
*/