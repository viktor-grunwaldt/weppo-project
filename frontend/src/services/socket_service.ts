import { Socket, io } from "socket.io-client";
// types copy pasted from backend types
// Feature: create a shared package with game logic and comm types
type serverMessage = "UGO" | "HEGOES" | "ONEMORE" | "BYE";
export type gameMessage = {
  message: "HEDID" | "ERR";
  move: number;
};
type new_room = (room: string) => void;

type clientMessage =
  // joining room means rdy
  // | {
  //     message: "RDY";
  //   }
  { message: "IDO"; move: number };

export interface ServerToClientEvents {
  server_message: (msg: serverMessage) => void;
  game_message: (msg: gameMessage) => void;
  new_room: new_room;
}

export interface ClientToServerEvents {
  create_user: (name?: string) => void;
  client_message: (
    msg: clientMessage,
    callback: (result: string) => void
  ) => void;
  join_room: (room: string, callback: (result: string) => void) => void;
  get_rooms: (callback: (msg: {rooms:string[]}) => void) => void;
}
const address = "http://192.168.1.200";
// const address = "http://localhost";
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `${address}:4000`,
  { autoConnect: false }
);
