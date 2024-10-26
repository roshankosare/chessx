import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Chess } from "chess.js";
import chessGameSocket from "./chess/chessSocket";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this in production
  },
});

app.use(
  cors({
    origin: "*",
  })
);

// Basic route
app.get("/", (req, res) => {
  res.send("chess game API"); // serve your HTML file
});

// Socket.IO connection

chessGameSocket(io);



// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
