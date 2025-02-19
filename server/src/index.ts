import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import {createServer} from 'http';
import { server, app, io } from '../src/socket/socket';
import dotenv from "dotenv";

dotenv.config();

const port: number = 4002;
const manglishWordsRouter = require('../src/routes/manglishWords.route');

app.use(cors({
    credentials: true, 
    origin: `${process.env.CLIENT_URL}`, 
    methods: ["GET", "POST"]  
    }));
    
app.use(express.json());

app.use('/malwords', manglishWordsRouter);

server.listen(port, () => {
    console.log('server is listening');
});

export { server };