export interface TileInterface {
  color: string;
  id: string;
  piece: Piece | null;
  selected: boolean;
  isLastMoveSquare: boolean;
}

export type PieceColor = "b" | "w";
export type PieceType = "p" | "k" | "r" | "n" | "q" | "b";
export type PlayingAS = "w" | "b";

export type Piece = {
  color: PieceColor;
  type: PieceType;
};

export type BoardPosElement = {
  square: string;
  piece: Piece | null;
};
export type GameTime = 1 | 3 | 5 | 10;

export type FixedLengthArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _FixedLengthArray<T, N, []>
  : never;
type _FixedLengthArray<
  T,
  N extends number,
  R extends unknown[],
> = R["length"] extends N ? R : _FixedLengthArray<T, N, [T, ...R]>;

// Now restrict the length of pos

export type BoardPos = FixedLengthArray<BoardPosElement | null, 64>;

export type ChessBoard = FixedLengthArray<TileInterface, 64>;

export type PlayerInfo = {
  username: string | null;
  remainingTime: number | null;
  avatar: string | null;
};

export type GameStatus =
  | "running"
  | "blackWins"
  | "whiteWins"
  | "draw"
  | "stalemate"
  | "ready";

  export type MoveHistory = [string, string][];

export type WonBy = "checkmate" | "timeout" | "resignation";
export type BoardStateKey =
  | "gameTime"
  | "waiting"
  |"start"
  | "gameStarted"
  | "playingId"
  | "roomId"
  | "boardPos"
  | "playingAS"
  | "selectedPiece"
  | "playersInfo"
  | "move"
  | "gameStatus"
  | "wonBy"
  | "possibleMoves"
  | "whiteCapturedPieces"
  | "blackCapturedPieces"
  | "moveHistory"
  | "promotionalMoves"
  | "promotionPiece"
  | "showPomotionWindow"
  | "matchType"
  | "diLevel"
  | "lastMove";

export type BoardStateValue = {
  gameTime: GameTime;
  waiting: boolean;
  start:boolean;
  gameStarted: boolean;
  playingId: string | null;
  roomId: string | null;
  boardPos: BoardPos | null;
  playingAS: PlayingAS | null;
  selectedPiece: string | null;
  playersInfo: {
    user: PlayerInfo;
    opponent: PlayerInfo;
  };
  move: { from: string | null; to: string | null };
  gameStatus: GameStatus;
  wonBy: WonBy | null;
  possibleMoves: string[];
  whiteCapturedPieces: string[];
  blackCapturedPieces: string[];
  moveHistory: MoveHistory;
  promotionalMoves: string[];
  promotionPiece: string | null;
  showPomotionWindow: boolean;
  matchType: "H" | "M";
  diLevel: 10 | 15 | 20 | 25;
  lastMove: { from: string | null; to: string | null };
}[BoardStateKey]; // This maps the BoardStateKey to its specific type

export interface BoardState {
  gameTime: GameTime;
  waiting: boolean;
  start:boolean;
  gameStarted: boolean;
  playingId: string | null;
  roomId: string | null;
  boardPos: BoardPos | null;
  playingAS: PlayingAS | null;
  selectedPiece: string | null;
  playersInfo: {
    user: PlayerInfo;
    opponent: PlayerInfo;
  };
  move: { from: string | null; to: string | null };
  gameStatus: GameStatus;
  wonBy: WonBy | null;
  possibleMoves: string[];
  whiteCapturedPieces: string[];
  blackCapturedPieces: string[];
  moveHistory: MoveHistory;
  promotionalMoves: string[];
  promotionPiece: string | null;
  showPomotionWindow: boolean;
  matchType: "H" | "M";
  diLevel: 10 | 15 | 20 | 25 | null;
  lastMove: { from: string | null; to: string | null };
}
