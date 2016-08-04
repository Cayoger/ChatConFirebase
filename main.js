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
              // console.log(user);
              // console.log(user.providerData[0].email);
              $("#login").fadeOut();
              innitApp();
            });
  }

  function innitApp(){
    userOn = database.ref("/connected");
    roomsRef = database.ref("/rooms");

    login(user.uid, user.displayName, user.email, user.photoURL);

    userOn.on("child_added",addUser);
    userOn.on("child_removed",removeUser);

  }

  function login(uid, name, email, photo){
    var conectado = userOn.push({
      uid: uid,
      name: name,
      email: email,
      photo: photo
    });

    onKey = conectado.key;
  }

  function unLogin() {
    database.ref("/connected/"+onKey).remove();
  }

  function addUser(data) {
    //si eres tu no apareces
    if (data.val().uid == user.uid) return;
    //si no eres tu se agrega todo lo siguiente
    //se pone en la lista
    var $li = $("<li>").addClass("collection-item")
                        .html(data.val().name)
                        .attr("id",data.val().uid)
                        .appendTo("#users");
    //se crea la notificacion
    var option = {
      body:data.val().email,
      icon:data.val().photo
    };
    var notification = new Notification("se conecto: "+data.val().name,option);
    //si se da click en un li se crea una sala
    $li.on("click",function(){
      var friendId = $(this).attr("id");

      var room = roomsRef.push({
        creator: user.uid,
        friend: friend
      });
    });
  }

  function removeUser(data) {
    $("#"+data.val().uid).slideUp('fast',function(){
      $(this).remove();
    });
  }

  // function notificar() {
  //   if (!("Notification" in window)) {
  //     alert("Este navegador no soporta notificaciones");
  //   } else if (Notification.permission === "granted") {
  //     var option = {
  //       body:"hola esto es una notificacion",
  //       icon:user.photoURL
  //     };
  //     var notification = new Notification(user.email,option);
  //   } else if (Notification.permission !== "denied") {
  //     Notification.requestPermission(function (permission) {
  //       if (permission === "granted") {
  //         var notification = new Notification("Hi there!");
  //       }
  //     });
  //   }
  // }
  //
})();
