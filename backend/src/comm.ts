import { Server } from "socket.io";

type serverMessage = "UGO" | "HEGOES" | "ONEMORE" | "BYE";
type gameMessage = {
  message: "HEDID" | "ERR";
  move: number;
};

type clientMessage =
  // joining room means rdy
  // | {
  //     message: "RDY";
  //   }
  { message: "IDO"; move: number };

export interface ServerToClientEvents {
  server_message: (msg: serverMessage) => void;
  game_message: (msg: gameMessage) => void;
}

export interface ClientToServerEvents {
  create_user: (name?: string) => void;
  client_message: (
    msg: clientMessage,
    callback: (result: string) => void
  ) => void;
  join_room: (room: string, callback: (result: string) => void) => void;
  get_rooms: (callback: (rooms: string[]) => void) => void;
}
export type BackendServer = Server<ClientToServerEvents, ServerToClientEvents>;
