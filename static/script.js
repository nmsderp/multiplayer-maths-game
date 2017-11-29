var username, answer, score=0, questionNum=0, i=0, state=1;
var colors = ["#80ffdf", "#66ffd9", "#4dffd2", "#33ffcc", "#1affc6", "#00ffbf", "#00e6ac", "#00cc99", "#00b386"];


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
  var $waiting = $('.waiting');


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

    $answer.val("");
    $('body').css("backgroundColor", "#FFF");
    $(".leaderboard").hide();

    questionNum++;
    answer = data.a + data.b;
    $("#questionNum").text("Question "+questionNum+"/5:");
    $("#question").text(data.a+" + "+data.b+" =");
    $questionArea.show();
  });

  //////RETHINK THE SCORING SYSTEM BECAUSE IM PRETTY SURE YOU CAN DO IT ALL SERVER SIDE.
  /////THAT WILL MEAN THAT ITS A LOT EASIER AND MORE EFFICIENT

  $questionForm.submit(function(e){
    e.preventDefault();
    if ($answer.val() == answer){
      score = 1;
    } else {
      score = 0;
    }
    socket.emit("question answered", score);
    $questionArea.hide();
    $waiting.show(); //Show waiting screen until all players submit an answerocean theme
    var rainbowAnimation = setInterval(function(){
      $waiting.css("backgroundColor", colors[i]);
      if(state==1){i++} else {i--};
      if (i === colors.length-1){
  				state=2;
  		} else if (i==0) {
        state=1;
      }
    }, 100);
  });

  socket.on("get leaderboard", function(scores){
    $waiting.hide();
    $(".leaderboard").show();
    var scores = scores.scores
    for(x=0; x<scores.length; x++){
      console.log(scores[x].name);
    }
    var html = "";
    for (x=0; x<scores.length; x++){
      if (scores[x].name == username){ score= scores[x].score; }
      html += "<li><strong>"+scores[x].name+"</strong>: "+scores[x].score+"</li>";
    }
    $(".leaderboard ul").html(html);
  //
  //   $questionArea.hide();
  //   $(".leaderboard").show();
  //   $('body').css("backgroundColor", "#eee");

  })

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
