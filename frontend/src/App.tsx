import { useState, useEffect } from "react";
import { socket } from "./services/socket_service";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import { MyForm } from "./components/MyForm";
import { Board } from "./components/Board";
import { Color } from "./services/game_logic";
import { Rooms } from "./components/Rooms";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [col, setCol] = useState<Color | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);
  
  useEffect(() => {
    function onDisconnect() {
      setIsConnected(false);
    }
    function onConnect() {
      setIsConnected(true);
    }
    function onServerMessage(msg: string) {
      console.log("Got message: ", msg);
      switch (msg) {
        case "UGO":
          setCol("X");
          break;
        case "HEGOES":
          setCol("O");
          break;
        case "ONEMORE":
          // not implemented
          break;
        case "BYE":
          setRoom("");
          setCol(null);
          break;
      }
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("server_message", onServerMessage);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("server_message", onServerMessage);
    };
  }, []);
  useEffect(() => {
    if (isConnected) {
      socket.emit("create_user");
      // TODO: for now, we use one room
      socket.emit("join_room", "test_room", (result) => {
        console.log(result);
      });
    }
  }, [isConnected, room]);
  return (
    <div className="App">
      {!room && <Rooms roomList={rooms}/>}
      {col && <Board playerColor={col} />}
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
}
