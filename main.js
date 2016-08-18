;(function(){
    var config = {
     apiKey: "AIzaSyBzpzhSKlnl7gAv3z4Y7v9hPQacQUWfIkQ",
     authDomain: "taller-66817.firebaseapp.com",
     databaseURL: "https://taller-66817.firebaseio.com",
     storageBucket: "taller-66817.appspot.com",
   };
   firebase.initializeApp(config);

   var database = firebase.database();
   var btn_log = document.getElementById('start-log');
   var user = null;
   var user_ref = null;
   var user_ref_key = null;
   var room_ref = null;

   btn_log.addEventListener("click", googleLog);
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
     user_ref = database.ref("/connected");
     room_ref = database.ref("/rooms");

     login(user.uid, user.displayName || user.email);

     user_ref.on("child_added",addUser);
     user_ref.on("child_removed",removeUser);

     room_ref.on("child_added",newRoom);
   }

   function login(uid, name){
     var conectado = user_ref.push({
       uid: uid,
       name: name
     });

     user_ref_key = conectado.key;
   }

   function unLogin() {
     database.ref("/connected/"+user_ref_key).remove();
   }

   function addUser(data) {
      //  lista, cuando eres tu no apareces en la lista
      if (data.val().uid == user.uid) return;
      // variables
      var mensaje = '<span><strong>'+data.val().name+'</strong> conectado</span>';
      var friend_id = data.val().uid;
      // se agrega a la lista
      var $li = $("<li>").addClass("collection-item")
      .html(data.val().name)
      .attr("id",friend_id)
      .appendTo("#users");
      // mensaje cuando se conectan
      Materialize.toast(mensaje, 4000,'indigo');
      // cuando le das click a la lista
      $li.on("click",function(){
        // crea una referencia de chat
        var room = room_ref.push({
          creator: user.uid,
          friend: friend_id
        });
        new Chat(room.key,user,"chats",database);
      });
  }

  function removeUser(data) {
    $("#"+data.val().uid).slideUp('fast',function(){
      $(this).remove();
    });
   }

   function newRoom(data) {
     if (data.val().friend == user.uid) {
       new Chat(data.key,user,"chats",database);
     }
   }

 })();
