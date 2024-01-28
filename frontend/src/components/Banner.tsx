import { MouseEventHandler } from "react";
import * as gl from "../services/game_logic";

type bProp = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  sor: gl.StageOrResult;
};

export function Banner(prop: bProp) {
  const startButton = <button onClick={prop.onClick}>Start Game</button>;
  const text = gl.getTextForStateOrResult(prop.sor);
  // TODO: maybe reuse button as ready/restart game
  return (
    <>
      <div style={{ display: "flex" }}>
        <p>{text}</p>
        {/* {prop.sor === gl.GameStage.NotStarted ? startButton : null} */}
      </div>
    </>
  );
}
