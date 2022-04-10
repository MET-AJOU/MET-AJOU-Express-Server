import {
    Server
} from 'socket.io';
import {
    corsOption
} from '../Common/Constant/index.js';
import {
    printConnection,
    initSocketEvents
} from './events.js';

export const socketInit = (server, app) => {
    console.log(corsOption);
    const io = new Server(server, {
        cors: corsOption
    });
    io.on('connection', (socket) => {
        printConnection(socket);
        initSocketEvents({
            io,
            socket
        });
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