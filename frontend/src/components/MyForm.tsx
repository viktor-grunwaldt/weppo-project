import { FormEvent, useState } from "react";
import { socket } from "../services/socket_service";

export function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit("create-something", value, () => {
      setIsLoading(false);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={(e) => setValue(e.target.value)} />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
