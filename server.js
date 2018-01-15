const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var users = [];
var scores = [];
var connections = [];
var answersReceived = 0;

app.use(express.static(__dirname + "/static/"));

server.listen(process.env.PORT || 8080);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})


io.sockets.on("connection", (socket) => {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  //DISCONNECT
  socket.on("disconnect", (data) => {
    if (socket.username){
      users.splice(users.indexOf(socket.username),1);
      scores.splice(scores.findIndex(i => i.name == socket.username),1);
      updateUsernames();
    }
    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected: %s sockets connected", connections.length);
  })

  //User Joining game
  socket.on("new player", (data) => {
    socket.username = data;
    users.push(data);
    scores.push({
      name: data,
      score: 0
    });
    updateUsernames();
  })

  //Update Usernames
  function updateUsernames(){
    io.sockets.emit("get players", {players: users});
  }

  //Get question
  socket.on("get question", () => {
    generateQuestion();
  })

  //Answer submitted
  socket.on("question answered", (score) => {
    answersReceived++;
    // if(score!=0){ //The score algorithm
    //   for (var i=0; i<2; i++) { //gives first 2 players to answer extra points (1st: 3 pts, 2nd: 2pts, others: 1pt)
    //     if(answersReceived == i+1){
    //       score += 2-i;
    //       break;
    //     }
    //   }
    // }
    var indexOfUser = scores.findIndex(i => i.name == socket.username);
    scores[indexOfUser].score += score;

    if(answersReceived==users.length){
      console.log(scores);
      io.sockets.emit("get leaderboard", {scores: scores});

      setTimeout(function(){
        generateQuestion();
      }, 5000);
    }
  })

  socket.on("end of game", function(){
    setTimeout(function(){
      resetGame();
    },2000);
  })

})

function generateQuestion(){
  var num1 = getRandomNum(1, 10);
  var num2 = getRandomNum(1, 10);
  io.sockets.emit("question generated", {a: num1, b: num2});
  answersReceived = 0;
}

function getRandomNum(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetGame(){
  io.sockets.emit("reset game", {winner: scores[0].name});
  users.length = 0;
  connections.length = 0;
  scores.length = 0;
}
