const path = require('path'),
http = require('http'),
socketIO = require('socket.io'),
app = express();

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var users = new Users();

app.use(express.static(path.join(__dirname, '../static')));
app.use(express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.set('port', 4000 || process.env.PORT);

const server = http.createServer(app);
var io = socketIO(server);

var clients = 0

io.on('connection', socket => {
clients++;
console.log(`New user Connected, Total: ${clients}`);

// socket.broadcast.emit("newMessage", generateMessage("Amdin", "A new user joined"));

socket.on('leaveRoom', (paramz, cb) => {
  socket.leave(paramz.room);

  var user = users.removeUser(socket.id);
  if (user) {
    io.to(user.room).emit("updateUserList", users.getUserList(user.room));
    io.to(user.room).emit("newMessage", generateMessage('Admin', `${user.name} just left`));
  }
  cb('left room');
});

socket.on('join', (params, cb) => {
  if (!isRealString(params.name || !isRealString(params.room))) {
    return cb('Name and Room name are required!');
  }

  socket.join(params.room);
  // socket.leave(room); to leave a room
  socket.emit('joinRoom', {name: params.room});

  users.removeUser(socket.id);
  users.addUser(socket.id, params.name, params.room);

  io.to(params.room).emit('updateUserList', users.getUserList(params.room));
  socket.emit('newMessage', generateMessage("Admin", "Welcome to " + params.room + ". Enjoy using TCS IM!"));
  socket.broadcast.to(params.room).emit("newMessage", generateMessage('Admin', params.name + " just joined"));

  socket.on("CreateMessage", (msg, cb) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(msg.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
    }

    cb("message acknowledged");
  });

  cb();
});

socket.on('disconnect', () => {
  clients--;
  console.log(`A user disconnected, total: ${clients}`);

  var user = users.removeUser(socket.id);
  if (user) {
    io.to(user.room).emit("updateUserList", users.getUserList(user.room));
    io.to(user.room).emit("newMessage", generateMessage('Admin', `${user.name} just left`));
  }
});
});

server.listen(app.get('port'), () => {
console.log(`App running on port ${app.get('port')}`);
});