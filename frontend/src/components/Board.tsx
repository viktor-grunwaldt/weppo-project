import { Square } from "./Square";
import * as gl from "../services/game_logic";
import { Banner } from "./Banner";
import { socket } from "../services/socket_service";

export function Board({ playerColor }: { playerColor: gl.Color }) {
  const state = gl.useCreateState();
  // since we're rendering board after joining the room, we should also start the game
  gl.startGame(state);

  // handle opponent's moves
  socket.on("game_message", (msg) => {
    if (msg.message === "HEDID") {
      const res = gl.MakeMove(state, msg.move);
      if (res) {
        console.log(res);
      }
    } else if (msg.message === "ERR") {
      console.log("not implemented");
    } else {
      throw Error("unreachable!");
    }
  });

  const nSquareClick = (i: number) => () => {
    // depending on gamemode type, make move (logic should be extracted eventually)
    if (!gl.isInvalidMove(state, i, playerColor)) {
      socket.emit("client_message", { message: "IDO", move: i }, (result) => {
        console.log(result);
        if (result === "ok") {
          gl.makeMoveColor(state, i, playerColor);
        }
      });
    }
  };
  const nthSquare = (i: number) => (
    <Square state={state.board[i]} handleClick={nSquareClick(i)} />
  );
  // prettier-ignore
  const startGame = () => {gl.startGame(state);};

  return (
    <>
      <Banner sor={gl.stateOrResult(state)} onClick={startGame} />
      <div className="board-row">
        {nthSquare(0)} {nthSquare(1)} {nthSquare(2)}
      </div>
      <div className="board-row">
        {nthSquare(3)} {nthSquare(4)} {nthSquare(5)}
      </div>
      <div className="board-row">
        {nthSquare(6)} {nthSquare(7)} {nthSquare(8)}
      </div>
      <br></br>
    </>
  );
}
