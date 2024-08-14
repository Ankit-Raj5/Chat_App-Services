const express = require("express");
const http = require('http');
const socketio = require('socket.io');

const connect = require('./config/database-config');
const Chat = require('./models/chat');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket)=>{
    console.log('a new client connected', socket.id);

    socket.on('join_room', (data)=>{
        console.log('joining room:',data.roomid);
        socket.join(data.roomid);
    })

    socket.on('msg_send', async (data)=>{
        console.log(data);
        // io.emit('msg_rcvd', data); // all user server recieves msg
        // socket.emit('msg_rcvd', data) // only sending server responds
        // socket.broadcast.emit('msg_rcvd', data); // only reciever responds
        
        const chat = await Chat.create({
            content: data.msg,
            roomId: data.roomid,
            user: data.username
        });
        io.to(data.roomid).emit('msg_rcvd', data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.to(data.roomid).emit('someone_typing');
    });

});

app.set('view engine', 'ejs');

app.use('/', express.static(__dirname + '/public'));

app.get('/chat/:roomid', async (req, res)=>{
    const chats = await Chat.find({
        roomid: req.params.roomid
    }).select('content user');
    console.log(chats);
    res.render('index', {
        name: 'Annn',
        id: req.params.roomid,
        chats: chats
    });
});

server.listen(3000, async ()=>{
    console.log("Server is running on port 3000");
    await connect();
    console.log('mongodb connected');
});