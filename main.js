;(function(){
  var config = {
    apiKey: "AIzaSyBzpzhSKlnl7gAv3z4Y7v9hPQacQUWfIkQ",
    authDomain: "taller-66817.firebaseapp.com",
    databaseURL: "https://taller-66817.firebaseio.com",
    storageBucket: "",
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var loginBtn = document.getElementById('start-log');
  var user = null;
  var userOn = null;
  var onKey = null;
  var roomsRef = null;

  loginBtn.addEventListener("click", googleLog);
  window.addEventListener("unload",unLogin);


  function googleLog() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
            .then(function(result){
              user = result.user;
              $("#login").fadeOut();
              innitApp();
            });
  }

  function innitApp(){
    userOn = database.ref("/connected");
    roomsRef = database.ref("/rooms");

    login(user.uid, user.displayName || user.email);

    userOn.on("child_added",addUser);
    userOn.on("child_removed",removeUser);

  }

  function login(uid, name){
    var conectado = userOn.push({
      uid: uid,
      name: name
    });

    onKey = conectado.key;
  }

  function unLogin() {
    database.ref("/connected/"+onKey).remove();
  }

  function addUser(data) {
    if (data.val().uid == user.uid) return;
    var $li = $("<li>").addClass("collection-item")
                        .html(data.val().name)
                        .attr("id",data.val().uid)
                        .appendTo("#users");

    $li.on("click",function(){
      var friendId = $(this).attr("id");

      var room = roomsRef.push({
        creator: user.uid,
        friend: friendId
      });
    });
  }

  function removeUser(data) {
    $("#"+data.val().uid).slideUp('fast',function(){
      $(this).remove();
    });
  }

})();
