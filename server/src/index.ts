import {createServer} from 'http';
import { Server, Socket } from 'socket.io';
import express from 'express';
import cors from 'cors';


export const app = express();
const server = createServer(app);
const port: number = 4002;
const manglishWordsRouter = require('./routes/manglishWords.route');

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST']
}));

app.use('/malwords', manglishWordsRouter);

declare module 'socket.io'{ //This tells TypeScript that you are augmenting the types of the socket.io module, specifically the Socket interface. Without this, TypeScript would have no knowledge of your custom changes to the Socket object. whenever we need to add new properties we need to sue decalre module
    interface Socket  {
      username?: string;
   } 
  }
  

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        methods: ['GET', 'POST']
    }
})

interface Join{
    username: string;
    imageFile: string;
}

interface MessegeData{
    username: string;
    roomId: string;
    messege: String;
    time: string;
  }

interface Data{
    file: File;
    username: string;
    roomId: string;
    userId: string;
    messege: String;
    time: string;
} 

interface File{ 
    filename: string;
    originalname: string;
}

interface callData{
    userToCall: string;
    signalData: string;
    from: string;
    name: string;
}


io.on('connection', (socket: Socket) => {
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
      
server.listen(port, () => {
    console.log('server is listening');
});