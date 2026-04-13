import express from 'express';
import 'dotenv/config';
import http from 'http'
import { matchRouter } from "./routes/matches.js"
import { attachWebSocketServer } from './ws/server.js';

const app = express();
const server = http.createServer(app)
const PORT = Number(process.env.PORT) || PORT;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json())

app.get('/', (req,res) => {
    res.send('hello server');
});

app.use('/matches', matchRouter)
const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

app.listen(PORT,HOST, ()=>{
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`server is running on port ${baseUrl}`);
    console.log(`websocket server is running on ${baseUrl.replace('http','ws')}/ws`);
});