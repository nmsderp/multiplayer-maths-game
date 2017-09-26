const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const $ = require('jquery');

var users = [];
var connections = [];
var scores = [];

app.use(express.static(__dirname + "/static/"));

server.listen(process.env.PORT || 8080);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

app.post("/login", (req, res) => {

})


io.sockets.on("connection", (socket) => {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  //DISCONNECT
  socket.on("disconnect", (data) => {
    if (socket.username){
      users.splice(users.indexOf(socket.username),1);
      updateUsernames();
    }
    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected: %s sockets connected", connections.length);
  })

  //User Joining
  socket.on("new player", (data) => {
    socket.username = data;
    users.push(data);
    updateUsernames();
    scores.push(data);
    scores[scores.indexOf(data)] = 0;
  })

  //Update Usernames
  function updateUsernames(){
    io.sockets.emit("get players", {players: users});
  }

  //Start Game
  socket.on("start game", () => {
    io.sockets.emit("game started");
  })

  //Correct answer
  socket.on("correct answer", (data) => {
    scores[scores.indexOf(data)] += 1;
    console.log(scores[scores.indexOf(data)]);
    io.sockets.emit("get scores", scores);
  })
})
