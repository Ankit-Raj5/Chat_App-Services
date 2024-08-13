const express = require("express");
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket)=>{
    console.log('a new client connected', socket.id);

    socket.on('from client', ()=>{
        console.log('message from client');
    })

    setInterval(()=>{
        socket.emit('from server');
    },90000);
});

app.use('/', express.static(__dirname + '/public'));

server.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})