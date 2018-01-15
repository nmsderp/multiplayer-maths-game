var username, answer, score=0, questionNum=0, i=0, state=1, winner;
var numOfQuestions = 1; //Set to number of question you want
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
    questionNum++;
    if (questionNum==1){
      $playersScreen.hide();

    }
    //if its the end of the game then emit "end of game" otherwise show question
    if (questionNum>numOfQuestions){
      socket.emit("end of game");
    } else {
      $answer.val("");
      $('body').css("backgroundColor", "#FFF");
      $(".leaderboard").hide();

      answer = data.a + data.b;
      $("#questionNum").text("Question "+questionNum+"/"+numOfQuestions+":"); //e.g. "Question 3/5:"
      $("#question").text(data.a+" + "+data.b+" ="); //e.g. "5 + 2 ="
      $questionArea.show();
    }
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
    $waiting.show(); //Show waiting screen until all players submit an answer ocean theme
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

  socket.on("get leaderboard", function(data){
    var scores = data.scores;
    // var isEnd = data.end;
    //
    // console.log(isEnd);

    scores.sort(function(a,b) { //sort by higher score
      return a.score < b.score;
    });

    $waiting.hide();
    $('body').css("backgroundColor", "#eee");
    $(".leaderboard").show();

    //output scores to the leaderboard
    var html = "";
    for (x=0; x<scores.length; x++){
      if (scores[x].name == username){ score= scores[x].score; }
      html += "<li><strong>"+scores[x].name+"</strong>: "+scores[x].score+"</li>";
    }
    $(".leaderboard ul").html(html);
  })

  socket.on("reset game", function(data){
    $(".leaderboard").hide();
    // console.log(data.winner);
    let msg = "Congratulations to " + data.winner;
    $(".winner h1").text(msg);
    $(".winner").show();
  });

});
