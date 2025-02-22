import express from 'express';
import cors from 'cors';
import { server, app} from '../src/socket/socket';
import dotenv from "dotenv";
import manglishWordsRouter from '../src/routes/manglishWords.route';
import { client_Url, server_Port } from '../src/sense_variable/variable';

app.use(cors({
    credentials: true, 
    origin: client_Url, 
    methods: ["GET", "POST"]  
    }));
    
app.use(express.json());

app.use('/malwords', manglishWordsRouter);

server.listen(server_Port, () => {  
    console.log('server is listening');
});

export { server };