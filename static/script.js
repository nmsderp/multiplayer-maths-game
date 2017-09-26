var username, a, b, answer, score = 0, time = 0, timer, questionNum=1;


$(function(){
  var socket = io.connect();
  var $loginForm = $('#loginForm');
  var $username = $('#username');
  var $playersScreen = $('.playersScreen');
  var $players = $('#playersInGame');
  var $questionArea = $('.questionArea');
  var $questionForm = $('#questionForm');
  var $question = $("#question");
  var $answer = $('#answer');

  $loginForm.submit(function(e){
    e.preventDefault();
    username = $username.val();
    socket.emit("new player", username);
    $loginForm.hide();
    $playersScreen.show();
  });

  socket.on("get players", function(data){
    var html = "";
    for (i=0; i<data.players.length; i++){
      html += "<li>"+data.players[i]+"</li>";
    }
    $players.html(html);
  })

  $('#startGame').click(function(){
    socket.emit("start game");
  });

  socket.on("game started", function(){
    $playersScreen.hide();
    $('body').css("backgroundColor", "#FFF");
    generateQuestion();
    $questionArea.show();
    timer = setInterval(function(){
      time++;
      console.log(time);
      if(time>=9){
        clearInterval(timer);
      }
    }, 500);
  })

  $questionForm.submit(function(e){
    e.preventDefault();
    clearInterval(timer);
    if ($answer.val() == answer){
      score += 10-time;
    }
    socket.on("answered", score);
    time=0;
  });

});

function generateQuestion(){
  questionNum++;
  a = getRandomNum(1, 10);
  b = getRandomNum(1, 10);
  answer = a + b;
  $("#questionNum").text("Question "+questionNum+"/10:");
  $("#question").text(a+" + "+b+" =");
}

function getRandomNum(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
