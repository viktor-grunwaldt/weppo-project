export function Rooms({ roomList }: { roomList: any[] }) {
  return (
    <>
      <ul>
        {roomList.map((room) =>
            <li>{room.name} <button onClick={room.join}>Join</button></li>)}
      </ul>
    </>
  );
}
