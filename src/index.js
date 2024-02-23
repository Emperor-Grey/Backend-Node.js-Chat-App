const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const { addUser, removeUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New Websocket Connected");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Welcome!!!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined!`));

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed(Bad words used)");
    }

    io.emit("message", generateMessage(message));
    callback();
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${latitude},${longitude}`,
      ),
    );

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has Left`),
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
