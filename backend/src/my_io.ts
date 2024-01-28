import {
  Rooms
} from "./rooms";
import { BackendServer } from "./comm";

export function io_handler(io: BackendServer, room_manager: Rooms) {
  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("create_user", (n) => room_manager.handle_new_user(socket, n));

    // game starts automatically after guest joins
    socket.on("join_room", (r, f) => {
      room_manager.handle_join_room(socket.id, r, f);
    });

    socket.on("client_message", (m, f) => {
      console.log(`client ${socket.id} sent a message: ${m}`);
      const is_valid = room_manager.handle_user_moved(socket.id, m, f);
      if (is_valid) {
      }
    });

    socket.on("get_rooms", room_manager.list_rooms);

    socket.on("disconnect", () => {
      room_manager.handle_disconnect_user(socket.id, );
    });
  });
}
