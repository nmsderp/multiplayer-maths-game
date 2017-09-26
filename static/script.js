var username, answer, preScore = 0, time = 0, timer, questionNum=0;


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

  socket.on("game started", function(data){
    $playersScreen.hide();
    $('body').css("backgroundColor", "#FFF");

    questionNum++;
    answer = data.a + data.b;
    $("#questionNum").text("Question "+questionNum+"/10:");
    $("#question").text(data.a+" + "+data.b+" =");
    $questionArea.show();
  })

  $questionForm.submit(function(e){
    e.preventDefault();
    if ($answer.val() == answer){
      preScore = 1;
      $question.css("color", "#33ff77");
      $question.text("Correct!");
    } else {
      preScore = 0;
      $question.css("color", "#FF2E63");
      $question.text("Incorrect!");
    }
    socket.emit("question answered", preScore);
  });

  socket.on("get leaderboard", function(data){
    var html = "";
    for (i=0; i<data.scores.length; i++){
      html += "<li><strong>"+data.scores[i].username+"</strong>: "+data.scores[i].score+"</li>";
    }
    $(".leaderboard ul").html(html);

    $questionArea.hide();
    $(".leaderboard").show();
    $('body').css("backgroundColor", "#FF2E63");
    console.log(data.scores);
  })

});
