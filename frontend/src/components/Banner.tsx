import { MouseEventHandler } from "react";
import * as gl from "../services/game_logic";

type bProp = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  sor: gl.StageOrResult;
  pCol: gl.Color;
};

export function Banner(prop: bProp) {
  // const startButton = <button onClick={prop.onClick}>Start Game</button>;
  // for now this is how we catch StateOrResult being null
  if (prop.sor === null) {
    console.log("wat:", prop);
  }
  const text = gl.getTextForStateOrResultMultiplayer(
    prop.sor !== null ? prop.sor : gl.GameResult.Draw,
    prop.pCol
  );
  // TODO: maybe reuse button as ready/restart game
  return (
    <>
      <div className="banner winner">
        <p>{text}</p>
        {/* {prop.sor === gl.GameStage.NotStarted ? startButton : null} */}
      </div>
    </>
  );
}
