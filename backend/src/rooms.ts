import { Socket } from "socket.io";
import {
  Color,
  State,
  createState,
  makeMoveColor,
  startGame,
} from "./game_logic";
import { ClientToServerEvents, ServerToClientEvents } from "./comm";

export type Player = {
  readonly name: string;
  readonly socket: Socket<ClientToServerEvents, ServerToClientEvents>;
  color?: Color;
  room?: Room;
};

type Room = {
  readonly name: string;
  host: Player;
  guest?: Player;
  game: State;
};
// type FullRoom = Room & {
//   guest: Player;
// };

export class Rooms {
  rooms: Map<string, Room>;

  users: Map<string, Player>;
  constructor() {
    this.rooms = new Map<string, Room>();
    this.users = new Map<string, Player>();
  }
  handle_join_room(id: string, rn: string, callback: (result: string) => void) {
    const u = this.users.get(id);
    if (!u) {
      // shouldn't happen
      callback("user not found");
      return;
    }
    const room = this.rooms.get(rn);
    if (room) {
      // room exists
      if (room.guest) {
        callback("room is full");
      } else {
        // 2nd player came
        room.guest = u;
        u.room = room;
        callback("joined as guest");
        console.log(`player ${u.name} joined room as guest`);
        // types aren't super intelligent
        beginGame(room);
        room.host.socket.emit("server_message", "UGO");
        room.guest.socket.emit("server_message", "HEGOES");
        return;
      }
    } else {
      // new room must be created
      const new_room = {
        name: rn,
        host: u,
        game: createState(),
      };
      // user saves their room
      u.room = new_room;
      // and inserted to rooms
      this.rooms.set(rn, new_room);

      console.log(`player ${u.name} created new room "${rn}"`);
      callback("joined as host");
      for (const p of this.users.values()) {
        if (typeof p.room === "undefined") {
          p.socket.emit("new_room", rn);
        }
      }
    }
  }

  // TODO: cleanup after user
  handle_disconnect_user(id: string) {
    console.log(`disconnected: ${id}`);
    const u = this.users.get(id);
    // if host leaves, and no guest, nuke the room
    if (u?.color === "X") {
      const r = u.room;
      if (r && !r.guest) {
        this.delete_room(r.name);
      }
    }
    this.users.delete(id);
  }

  list_rooms(callback: (msg: { rooms: string[] }) => void) {
    const rooms = Array.from(this.rooms.values());
    console.log("rooms list", rooms.map((a)=> a.name));
    const msg = {
      rooms: rooms.map((r) => r.name),
    };
    callback(msg);
  }

  delete_room(rn: string) {
    const r = this.rooms.get(rn);
    if (!r) {
      return;
    }
    if (r.guest) {
      r.guest.room = undefined;
    }
    r.host.room = undefined;
    this.rooms.delete(rn);
  }

  handle_new_user(s: Socket, name?: string): void {
    const p = {
      name: name ? name : "anon",
      socket: s,
    };
    this.users.set(s.id, p);
    console.log("added user:", p.name);
    for (const [k, v] of this.users.entries()) {
      console.log(k, v.name);
    }
  }

  handle_user_moved(
    id: string,
    msg: { message: string; move: number },
    callback: (result: string) => void
  ) {
    // sprinkle a bit of data sanitisation
    console.log(id, msg, callback);
    if (msg.message !== "IDO" || typeof msg.move === "undefined") {
      return callback("invalid message");
    }

    const u = this.users.get(id);
    if (!u) {
      return callback("user doesn't exist");
    }
    if (!u.room) {
      return callback("user is not in a room");
    }
    const res = makeMoveColor(u.room.game, msg.move, u.color!);
    callback(res ? res : "ok");
    const other_player = u == u.room.host ? u.room!.guest! : u.room!.host;
    other_player.socket.emit("game_message", {
      message: "HEDID",
      move: msg.move,
    });
  }
}

export function beginGame(r: Room) {
  // Feature: ask players for colors?
  r.host.color = "X";
  r.guest!.color = "O";

  startGame(r.game);
  // sending ugo to host inside socket.on callback
}

// on success returns other user in order to send him message
