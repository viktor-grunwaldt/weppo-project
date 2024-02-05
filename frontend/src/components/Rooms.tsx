import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { socket } from "../services/socket_service";
export function Rooms({
  setHasRoom,
}: {
  setHasRoom: Dispatch<SetStateAction<boolean>>;
}) {
  const [rooms, setRooms] = useState<string[]>([]);
  const [value, setValue] = useState("test");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function appendRoom(room_name: string) {
      setRooms((rooms) => rooms.concat(room_name));
    }
      socket.emit("create_user");
      // doesn't work
      socket.emit("get_rooms", (msg) => {
        console.log("got rooms:", msg);
        setRooms(msg.rooms);
      });
    socket.on("new_room", appendRoom);
    return () => {
      socket.off("new_room", appendRoom);
    };
  }, []);
  function handleRoomJoin(res: string) {
    setIsLoading(false);
    console.log("recieved join_room confirmation");
    if (res === "joined as guest" || res === "joined as host") {
      setHasRoom(true);
      console.log("setHasRoom triggered");
    }
  }
  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    console.log("sent join room");
    socket.emit("join_room", value, handleRoomJoin);
  }
  function roomButton(room:string, i:number) {
    return (
      <button
        key={i}
        onClick={(e) => {
          e.preventDefault();
          setIsLoading(true);
          socket.emit("join_room", room, handleRoomJoin);
        }}
      >
        Join room {room}
      </button>
    )
  }
  
  return (
    <>
      {rooms.map((room, i) => roomButton(room, i))}
      <form onSubmit={onSubmit}>
        <input
          onChange={(e) => setValue(e.target.value)}
          required={true}
        />
        <button type="submit" disabled={isLoading}>
          Create new room
        </button>
      </form>
    </>
  );
}
