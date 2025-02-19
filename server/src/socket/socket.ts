import { createServer } from 'http';
import { Server } from "socket.io";
import express from 'express';
import dotenv from "dotenv";
import { Data, MessegeData } from 'typings/passport';

dotenv.config()

const app = express();
const server = createServer(app);
const port: number = 4002;

const io = new Server(server, {
    cors: {
        origin: [`${process.env.CLIENT_URL}`],
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket: any) => {
    console.log(`${socket.id} connected`); 

    socket.on('join-room', (roomId: string, username: string) => {
        if(roomId){
            socket.join(roomId);
            console.log(`user with id ${socket.id} have joined room id ${roomId}`);
        }else{
            console.log('roomId is not received');
        }
    })
  
    socket.on('messege-data', (data: MessegeData) =>{
      console.log(data);     
        if(data){ 
            console.log(`messege from ${data.username} messege is ${data.messege} messege is for room ${data.roomId}`);
            io.in(data.roomId).emit('messege', data);
        }else{
            console.log('messege data didnt recived');
        }
    })
        
    socket.on('fileUpload', (data: Data) => {
        console.log('File uploaded:', data.file);
        io.to(data.roomId).emit('messege', {
        username: data.username,
        userId: data.userId,
        roomId: data.roomId,
        messege: data.file,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes()
    })
    })
 
    socket.on('disconnect', () => {
        console.log(`a user with id: ${socket.id} disconnected `);
        //removing disconnected groupUsers from groupusers array
        socket.broadcast.emit('user disconnected', { userID: socket.id });
    });
})
      
export { server, app, io  };