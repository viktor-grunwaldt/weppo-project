import { socket } from "../services/socket_service";

export function ConnectionManager({ isConnected }: { isConnected: boolean }) {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    // TODO: add form to send username
    <>
      {isConnected ? (
        <button onClick={disconnect}>Disconnect</button>
        ) : (
        <button onClick={connect}>Connect</button>
      )}
    </>
  );
}
