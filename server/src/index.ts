import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io'; // TODO: Remove this import as it is not used
import {createServer} from 'http'; // TODO: Remove this import as it is not used
import { server, app, io } from '../src/socket/socket';
import dotenv from "dotenv";

dotenv.config(); // TODO: Move this env config to a common place and call dotenv.config() only in that place

const port: number = 4002; // TODO: Use process.env for port
const manglishWordsRouter = require('../src/routes/manglishWords.route'); // TODO: Why we are mixing import and require?

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