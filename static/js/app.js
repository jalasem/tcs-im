var socket = io();
socket.on('message', function (data) {
  $('#message').text(data);
});
socket.on('testerEvent', function (Tdata) {
  $('#test').text(Tdata.description);
});

socket.emit('clientEvent', 'Sent an event from the client!');

socket.on('broadcast', function (Bdata) {
  $('#broadcast').text(Bdata.description);
});

socket.on('newclientconnect', function (Cdata) {
  $('#newC').text(Cdata.description);
});