const express = require("express"),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);


app.use(express.static(__dirname + '/node_modules'));
app.use(express.static('./static'));
app.set('port', process.env.PORT || '4000');

var clients = 0;

// var nsp = io.of('/my-namespace');
// nsp.on('connection', function(socket){
//   console.log('someone connected');
//   nsp.emit('hi', 'Hello everyone!');
// });

//Whenever someone connects this gets executed
io.on('connection', socket => {
  clients++;
  console.log('A user connected');

  socket.on('clientEvent', function(data){
    console.log(data);
  });

  io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});

  socket.emit('newclientconnect',{ description: 'Hey, welcome!'});

  socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'});

  setTimeout( () => {

    socket.send('Sent a message 4seconds after connection!');

    socket.emit('testerEvent', { description: 'A custom event named testerEvent!'});

  }, 4000);

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', () => {
    clients--;
    console.log('A user disconnected');
  });

});

http.listen(app.get('port'), () => {
  console.log(`listening on *:${app.get('port')}`);
});
