var username, answer, score=0, questionNum=0;


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
    socket.emit("get question");
  });

  socket.on("question generated", function(data){
    if (questionNum==0){
      $playersScreen.hide();
    }

    $('body').css("backgroundColor", "#FFF");

    questionNum++;
    answer = data.a + data.b;
    $("#questionNum").text("Question "+questionNum+"/5:");
    $("#question").text(data.a+" + "+data.b+" =");
    $questionArea.show();
  });

  //////RETHINK THE SCORING SYSTEM BECAUSE IM PRETTY SURE YOU CAN DO IT ALL SERVER SIDE.
  /////THAT WILL MEAN THAT ITS A LOT EASIER AND MORE EFFICIENT
//
//   $questionForm.submit(function(e){
//     e.preventDefault();
//     if ($answer.val() == answer){
//       score += 1;
//       $question.css("color", "#33ff77");
//       $question.text("Correct!");
//     } else {
//       $question.text("Incorrect!");
//     }
//     socket.emit("question answered", score);
//   });
//
//   socket.on("get leaderboard", function(data){
//     var html = "";
//     for (i=0; i<data.scores.length; i++){
//       if (data.scores[i].username == username){ score=data.scores[i].score; }
//       html += "<li><strong>"+data.scores[i].username+"</strong>: "+data.scores[i].score+"</li>";
//     }
//     $(".leaderboard ul").html(html);
//
//     $questionArea.hide();
//     $(".leaderboard").show();
//     $('body').css("backgroundColor", "#eee");
//
//     // setTimeout(function(){
//     //   console.log("hi");
//       // socket.emit("get question");
//     // },5000);
//   })
//
//   socket.on("next question", function(data){
//     $(".leaderboard").hide();
//
//     //resetting colours and fields
//     $question.css("color", "#FF2E63");
//     $answer.val("");
//     $('body').css("backgroundColor", "#fff");
//
//     questionNum++;
//     answer = data.a + data.b;
//     $("#questionNum").text("Question "+questionNum+"/5:");
//     $("#question").text(data.a+" + "+data.b+" =");
//     $questionArea.show();
//   });
//
});
