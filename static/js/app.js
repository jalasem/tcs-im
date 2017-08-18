var socket = io();

socket.on('connect', function () {
  console.log("Connected to server");
  var params = $.deparam();

  if (params.name) {
    window.myName = params.name;
    if(params.room) {
      socket.emit('join', params, function (err) {
        if (err) {
          alert(err);
          window.location.href = '/';
        } else {
          console.log('no errors');
        }
      });
    } else {
      var name = params.name;
      socket.emit('join', {name: name, room: "Lobby"}, function(err) {
        if(err) {
          alert(err);
          window.location.href = '/';
        } else {
          console.log('no errors');
        }
      })
    }
  } else {
    alert("You need to login!");
    window.location.href = '/';
  }
});

socket.on('joinRoom', function(room){
  $('#roomName').text(room.name);
});

socket.on('newMessage', function (msg) {
  var chat = '';
  chat += '<div class="chat card">';
  chat += '<div class="message left">';
  chat += '<p class="sender_details">' + msg.from + ' <span class="sender_username">@' + msg.from + '</span> </p>';
  chat += ' <p class="sender_message">' + msg.text + '</p>';
  chat += '</div>';
  chat += '<div class="right details">';
  chat += '<p class="date right">';
  chat += '' + new Date(msg.createdAt).toDateString() + ' &nbsp;';
  // chat += '<i class="status icon ion-ios-checkmark-outline x15"></i>';
  chat += '<br>';
  chat += '<span class="time right">'+ moment(msg.createdAt).format('h:mma') +' &nbsp; &nbsp; </span>';
  chat += '</p>';
  chat += '</div>';
  chat += '</div>';
  $('#chats').append(chat);

  scrollToBottom();
});

socket.on('updateUserList', function(users) {
  // console.log(JSON.stringify(data, undefined, 2));
  var ul = $('<ul></ul>');

  users.forEach( function (user) {
    ul.append('<li><a href="#" class="waves-effect brown lighten-5 brown-text text-darken-2"> ' + user + ' </a></li>');
  });

  $('#users').html('<h4 class="heading"> <i class="icon ion-ios-people x1"></i> Active Users</h4>');
  $('#users').append(ul);
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();

  var message = $('#message2send').val();

  if(message) {
    socket
      .emit('CreateMessage', {
        text: message
      }, function (ack) {
        if (ack === 'message acknowledged') {
          $('.chat:last-child>.right>p.date').prepend('<i class="status icon ion-ios-checkmark-outline x15 right"></i>');
        }
        $('#message2send').val('');
      });
  }
});

$('#rooms>ul>li').click(function(e){
  var newR = e.currentTarget.innerText;
  var oldR = $('#roomName').text();

  changeRoom(oldR, newR);
});

function scrollToBottom() {
  //  selectors
  var messages = $('#appArea');
  var newMessage = messages.children('.chat:last-child');
  //  heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

function changeRoom(oldR, newR) {
  if(oldR.trim() != newR.trim()){
    socket.emit('leaveRoom', {name: oldR}, function(ack) {
      if(ack === 'left room') {
        var myName = window.myName;
        socket.emit('join', {name: myName, room: newR}, function(err) {
          if(err){
            alert('error switching to ' + newR);
          } else {
            var welcomeMsg = $('#chats>.chat:last-child').html();
            var chat = $('<div class="chat card"></div>');
            chat.append(welcomeMsg);
            $('.chat').remove();
            $('#chats').html(chat);
          }
        });
      }
    });
  }
}


socket.on('message', function (data) {
  $('#message').text(data);
});
socket.on('testerEvent', function (Tdata) {
  $('#test').text(Tdata.description);
});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

// socket.emit('clientEvent', 'Sent an event from the client!');

// socket.on('broadcast', function (Bdata) {
//   $('#broadcast').text(Bdata.description);
// });

// socket.on('newclientconnect', function (Cdata) {
//   $('#newC').text(Cdata.description);
// });