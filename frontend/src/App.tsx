import { useState, useEffect } from "react";
import { socket } from "./services/socket_service";
import { ConnectionManager } from "./components/ConnectionManager";
import { Board } from "./components/Board";
import { Color } from "./services/game_logic";
import { Rooms } from "./components/Rooms";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [hasRoom, setHasRoom] = useState(false);
  const [color, setColor] = useState<Color | null>(null);

  useEffect(() => {
    function onDisconnect() {
      setIsConnected(false);
      setHasRoom(false);
    }
    function onConnect() {
      setIsConnected(true);
    }
    function onServerMessage(msg: string) {
      console.log("Got message: ", msg);
      switch (msg) {
        case "UGO":
          setColor("X");
          break;
        case "HEGOES":
          setColor("O");
          break;
        case "ONEMORE":
          // not implemented
          break;
        case "BYE":
          // not implemented
          setHasRoom(false);
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
  
  return (
    <div className="App">
      {hasRoom && <Board playerColor={color!} />}
      {isConnected && !hasRoom && <Rooms setHasRoom={setHasRoom} />}
      <ConnectionManager isConnected={isConnected} />
    </div>
  );
}
