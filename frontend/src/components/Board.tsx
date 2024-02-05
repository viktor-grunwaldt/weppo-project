import { Square } from "./Square";
import * as gl from "../services/game_logic";
import { Banner } from "./Banner";
import { socket, gameMessage } from "../services/socket_service";
import { useEffect } from "react";

export function Board({ playerColor }: { playerColor: gl.Color }) {
  // since we're rendering board after joining the room, we should also start the game
  const state = gl.useCreateState();
  if (state.gameStage == gl.GameStage.NotStarted) {
    gl.startGame(state);
  }
  useEffect(() => {
    function handleGameMessage(msg: gameMessage) {
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
    }
    socket.on("game_message", handleGameMessage);
    return () => {
      socket.off("game_message", handleGameMessage);
    };
  }, [state]);
  // handle opponent's moves

  const nSquareClick = (i: number) => () => {
    // depending on gamemode type, make move (logic should be extracted eventually)
    if (!gl.isInvalidMove(state, i, playerColor)) {
      socket.emit("client_message", { message: "IDO", move: i }, (result) => {
        if (result === "ok") {
          gl.makeMoveColor(state, i, playerColor);
        } else {
          // wacky zone
          console.log(result);
        }
      });
    }
  };
  const nthSquare = (i: string) => (
    <Square
      state={state.board[parseInt(i)]}
      handleClick={nSquareClick(parseInt(i))}
      key={i}
    />
  );
  // prettier-ignore
  const startGame = () => {gl.startGame(state);};

  return (
    <>
      <Banner
        sor={gl.stateOrResult(state)}
        onClick={startGame}
        pCol={playerColor}
      />
      <div className="board">
        {Array.from("012345678").map((i) => nthSquare(i))}
      </div>
      <br></br>
    </>
  );
}
