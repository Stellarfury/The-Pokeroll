import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve frontend files
app.use(express.static("./"));

// Waiting players
let waiting = { 2: [], 3: [], 4: [] };

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🎮 Find match
  socket.on("find-match", ({ players }) => {
    if (!waiting[players]) return;

    waiting[players].push(socket);

    if (waiting[players].length === players) {
      let roomId = "room-" + Math.random().toString(36).slice(2, 7);
      let roomPlayers = waiting[players];

      roomPlayers.forEach((s) => s.join(roomId));

      roomPlayers.forEach((s) => {
        s.emit("match-found", {
          roomId,
          players: roomPlayers.map((p) => p.id),
        });
      });

      waiting[players] = [];
    }
  });

  // 🎲 Roll event
  socket.on("roll", ({ roomId, roll, playerId }) => {
    socket.to(roomId).emit("opponent-roll", { roll, playerId });
  });

  // ❌ Handle disconnect (important)
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (let key in waiting) {
      waiting[key] = waiting[key].filter((s) => s.id !== socket.id);
    }
  });
});

// 🌍 Railway-friendly port
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Running on " + PORT);
});
