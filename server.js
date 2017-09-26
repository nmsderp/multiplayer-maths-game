const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const $ = require('jquery');

var users = [];
var connections = [];
var scores = [];
var answersReceived = 0;

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

  //User Joining game
  socket.on("new player", (data) => {
    socket.username = data;
    users.push(data);
    updateUsernames();
  })

  //Update Usernames
  function updateUsernames(){
    io.sockets.emit("get players", {players: users});
  }

  //Start Game
  socket.on("start game", () => {
    var num1 = getRandomNum(1, 10);
    var num2 = getRandomNum(1, 10);
    io.sockets.emit("game started", {a: num1, b: num2});
    answersReceived = 0;
  })

  //Answer submitted
  socket.on("question answered", (data) => {
    if(data!=0){
      for (var i=0; i<=Math.ceil(users.length/2); i++) {
        if(answersReceived == i){
          data *= (users.length-i);
          break;
        }
      }
    }
    scores.push({username: socket.username, score: data});
    answersReceived++;
    if(answersReceived==users.length){
      io.sockets.emit("get leaderboard", {scores: scores});
      scores.length = 0;
    }
  })

})

function getRandomNum(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
