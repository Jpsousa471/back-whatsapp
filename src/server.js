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

    socket.on('disconnect', () =>{

    })

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

    socket.on("joinIndividual", (userId) => {
        //verifique se o destinatáro está conectado
        const user = users.find((user) => user.id === userId);
        if (user) {
            // crie um novo chat individual
            chats[userId] = {};
            io.to (userId).emit("joinIndividual", socket.id);
        }
    })

    socket.on("messageIndividual", (messageIndividual, userId) => {
        // verifique se há o chat individual
        if (chats[userId]) {
            // envie a menssagem para o usuário destinado
            io.to(userId).emit("messageIndividual", messageIndividual);
        }
    })

})

server.listen(port, () => console.log(`Server rodando na porta ${port}`))