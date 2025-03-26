const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;

// on -> escuta o receptor
// emit -> enviando algum dado

const users = [];
const chats = {}

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
      });
    

    socket.on("join", (name) =>{
        const user = {id: socket.id, name};
        users.push(user);
        // io.emit("message", {name: null, message: `${name} entrou no chat`})
        io.emit("users", users)
    })

    console.log(`usuário: ${socket.id} se conectou`)

    socket.on("message", (message) =>{
        io.emit("message", message);
    })

    socket.on("privateMessage", ({ recipientId, message }) => {
        if (users[recipientId]) {
          io.to(recipientId).emit("privateMessage", {
            sender: users[socket.id],
            message,
          });
        }
      });
    

   
})

server.listen(port, () => console.log(`Server rodando na porta ${port}`))


