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

export type State = {
  board: Cell[];
  gameStage: GameStage;
};

export function createState() {
  const r: State = {
    board: Array(BSIZE).fill(null),
    gameStage: GameStage.NotStarted,
  };
  return r;
}

export function getCurrentPlayer(state: State): Color | null {
  // prettier-ignore
  return state.gameStage === GameStage.PlayerXTurn ? "X"
         : state.gameStage === GameStage.PlayerOTurn? "O"
         : null;
}

export function isValidMove(state: State, i: number, p: Color): null | string {
  const currPl = getCurrentPlayer(state);
  // prettier-ignore
  return currPl === null                    ? "invalid gamestate"
         : currPl != p                      ? "not his turn"
         : !(0 <= i && i <= BSIZE)          ? "out of bounds"
         : state.board[i]                    ? "square not empty"
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
  const res = isValidMove(state, i, p);
  if (res) {
    return res;
  }
  const nb = state.board.slice();
  nb[i] = p;
  // sooo, it looks like SetStates triggers asynchronously
  // which means I also have to set state manually for the rest of the code to work
  state.board = nb;
  const nextStage =
    isDraw(state) || getWinner(state) !== null
      ? GameStage.Finished
      : nextTurn(state.gameStage);
  state.gameStage = nextStage;
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
    state.gameStage = GameStage.PlayerXTurn;
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
