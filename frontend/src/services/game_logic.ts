import { useState } from "react";
const BSIZE = 9;
export enum GameStage {
  NotStarted,
  PlayerXTurn,
  PlayerOTurn,
  Finished,
}
export enum GameResult {
  PlayerXWon = 4,
  PlayerOWon,
  Draw,
}

type _GameStage = Omit<GameStage, GameStage.Finished>;

export type StageOrResult = _GameStage | GameResult;

export type Color = "X" | "O";
export type Cell = Color | null;
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function check3<T>(a: T, b: T, c: T) {
  return a && a == b && a == c;
}

export function nextTurn(g: GameStage) {
  switch (g) {
    case GameStage.PlayerOTurn:
      return GameStage.PlayerXTurn;
    case GameStage.PlayerXTurn:
      return GameStage.PlayerOTurn;
    // unreachable
    default:
      throw "unreachable!";
  }
}

// function stepBy<T>(a: T[], b: number) {
//   return a.filter((_, i) => i % b === 0);
// }
export type State = {
  board: Cell[];
  gameStage: GameStage;
  setBoard: React.Dispatch<React.SetStateAction<Cell[]>>;
  setGameStage: React.Dispatch<React.SetStateAction<GameStage>>;
};
export function useCreateState() {
  const [b, sb] = useState(Array(BSIZE).fill(null));
  const [gs, sgs] = useState(GameStage.NotStarted);
  const r: State = {
    board: b,
    gameStage: gs,
    setBoard: sb,
    setGameStage: sgs,
  };
  startGame(r);
  return r;
}

// function constructor(state) {
//     boardSize = 9;
//     board = ;
//     gameStage = GameStage.NotStarted;
//   }

export function getCurrentPlayer(state: State): Color | null {
  // prettier-ignore
  return state.gameStage === GameStage.PlayerXTurn ? "X"
         : state.gameStage === GameStage.PlayerOTurn? "O"
         : null;
}

export function isInvalidMove(
  state: State,
  i: number,
  p: Color
): null | string {
  const currPl = getCurrentPlayer(state);
  // prettier-ignore
  return currPl === null           ? "invalid gamestate"
         : currPl != p             ? "not his turn"
         : !(0 <= i && i <= BSIZE) ? "out of bounds"
         : state.board[i]          ? "square not empty"
         : null;
}

export function getWinner(state: State): GameResult | null {
  for (const row_nums of lines) {
    const row = row_nums.map((i) => state.board[i]);
    if (check3(row[0], row[1], row[2])) {
      return row[0] === "X" ? GameResult.PlayerXWon : GameResult.PlayerOWon;
    }
  }
  return null;
}
export function isDraw(state: State): boolean {
  return state.board.reduce((acc, e) => acc && e != null, true);
}
export function makeMoveColor(
  state: State,
  i: number,
  p: Color
): string | null {
  const res = isInvalidMove(state, i, p);
  if (res) {
    return res;
  }
  const nb = state.board.slice();
  nb[i] = p;
  // sooo, it looks like SetStates triggers asynchronously
  // which means I also have to set state manually for the rest of the code to work
  state.board = nb;
  state.setBoard(nb);
  const nextStage =
    isDraw(state) || getWinner(state) !== null
      ? GameStage.Finished
      : nextTurn(state.gameStage);
  state.setGameStage(nextStage);
  return null;
}

export function MakeMove(state: State, i: number): null | string {
  switch (state.gameStage) {
    case GameStage.NotStarted:
      return "GameStage NotStarted";
    case GameStage.Finished:
      return "GameStage Finished";
    default:
      return makeMoveColor(state, i, getCurrentPlayer(state)!);
  }
}
export function startGame(state: State): boolean {
  const has_started = state.gameStage === GameStage.NotStarted;
  if (has_started) {
    state.setGameStage(GameStage.PlayerXTurn);
  }
  return has_started;
}
export function stateOrResult(state: State): StageOrResult {
  if (state.gameStage !== GameStage.Finished) {
    return state.gameStage;
  }
  // we the only way to have gs == finished is eqv to getWinner not being null
  return getWinner(state)!;
}

export function getTextForStateOrResultSinglePlayer(
  state: StageOrResult
): string {
  switch (state) {
    case GameStage.NotStarted:
      return "Not Started";
    case GameStage.PlayerXTurn:
      return "Player X Turn";
    case GameStage.PlayerOTurn:
      return "Player O Turn";
    case GameResult.PlayerXWon:
      return "Player X Won";
    case GameResult.PlayerOWon:
      return "Player O Won";
    case GameResult.Draw:
      return "Draw";
    default:
      throw new Error(`Unexpected game stage or result: ${state}`);
  }
}

export function getTextForStateOrResultMultiplayer(
  state: StageOrResult,
  pCol: Color
): string {
  const fwhose = (c: Color) => (pCol === c ? "Your" : "Opponent's");
  const fwho = (c: Color) => (pCol === c ? "You" : "Opponent");
  switch (state) {
    case GameStage.NotStarted:
      return "Not Started";
    case GameStage.PlayerXTurn:
      return `${fwhose('X')} Turn`;
    case GameStage.PlayerOTurn:
      return `${fwhose('O')} Turn`;
    case GameResult.PlayerXWon:
      return `${fwho('X')} Won`;
    case GameResult.PlayerOWon:
      return `${fwho('O')} Won`;
    case GameResult.Draw:
      return "Draw";
    default:
      throw new Error(`Unexpected game stage or result: ${state}`);
  }
}
