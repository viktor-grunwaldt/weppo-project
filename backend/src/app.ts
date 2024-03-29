import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  BackendServer,
  ServerToClientEvents,
} from "./comm";
import { Rooms } from "./rooms";
import { io_handler } from "./my_io";

const app = express();
const server = http.createServer(app);
const PORT = 4000;
const CLIENT_PORT = 5173;
const origin = "*";
// const origin = `http://localhost:${CLIENT_PORT}`;
app.use(cors());
const io: BackendServer = new Server<
  ClientToServerEvents,
  ServerToClientEvents
>(server, {
  cors: {
    origin,
  },
});

const room_manager = new Rooms();

io_handler(io, room_manager);

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
