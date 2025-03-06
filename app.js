const express = require("express");
const app = express();
const port = 3000;
const http = require("http");
const socketio = require("socket.io")
const path = require("path");


const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", function (socket) {
  socket.on("send-loc", function (data) {
    io.emit("rec-loc", { id: socket.id, ...data })
  })
});

io.on("disconnect", function () {
  io.emit("user-discon", socket.id);
});

app.get("/", (req, res) => {
  res.render("index");
});



server.listen(port, function () {
  console.log(`server running on localhost:${port}`);
})