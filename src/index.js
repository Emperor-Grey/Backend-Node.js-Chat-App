const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New Websocket Connected");

  socket.emit("message", "Welcome User!!!");
  socket.broadcast.emit("sendMessage", "A new user has joined");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed(Bad words used)");
    }

    io.emit("message", message);
    callback();
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${latitude},${longitude}`,
    );

    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
