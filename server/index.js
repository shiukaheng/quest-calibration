const WebSocket = require('ws');

const wss = new WebSocket.Server({
    host: "localhost",
    port: 8080
});

wss.on('connection', (ws) => {
    console.log('A client connected');
    ws.on('message', (data)=>{
        console.log(data)
    })
});
