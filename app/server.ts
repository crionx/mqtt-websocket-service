import express from 'express';
import http from 'http';
import mqtt from 'mqtt';
import WebSocket from 'ws';


const brokerUrl = process.env.BROKER_URL || 'mqtt://localhost';
var topic = process.env.TOPIC || ' ';
const port = process.env.PORT || 8997;
const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
    var client = mqtt.connect(brokerUrl);

    ws.on('message', (topic_r: string) => {
        client.unsubscribe(topic);
        topic = process.env.TOPIC || topic_r;
        client.subscribe(topic);
    })

    client.on('message', (topic, message) => {
        ws.send(message.toString());
    })
})

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});