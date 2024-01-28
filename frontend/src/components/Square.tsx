import { MouseEventHandler } from "react";
import { Color } from "../services/game_logic";

type SquareProps = {
  state: Color | null;
  handleClick: MouseEventHandler<HTMLButtonElement>;
};
export function Square({ state, handleClick }: SquareProps) {
  return (
    <button className="square" onClick={handleClick}>
      {state}
    </button>
  );
}
