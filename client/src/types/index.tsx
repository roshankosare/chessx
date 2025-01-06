export interface TileInterface {
  color: string;
  id: string;
  piece: Piece | null;
  selected: boolean;
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

export type FixedLengthArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _FixedLengthArray<T, N, []>
  : never;
type _FixedLengthArray<
  T,
  N extends number,
  R extends unknown[]
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

export type WonBy = "checkmate" | "timeout";
export type BoardStateKey =
  | "waiting"
  | "gameStarted"
  | "playingId"
  | "roomId"
  | "boardPos"
  | "playingAS"
  | "selectedPiece"
  | "from"
  | "user"
  | "oponent"
  | "to"
  | "gameStatus"
  | "wonBy";

export type BoardStateValue = {
  waiting: boolean;
  gameStarted: boolean;
  playingId: string | null;
  roomId: string | null;
  boardPos: BoardPos | null;
  playingAS: PlayingAS | null;
  selectedPiece: string | null;
  from: string | null;
  user: PlayerInfo | null;
  oponent: PlayerInfo | null;
  to: string | null;
  gameStatus: GameStatus;
  wonBy: WonBy | null;
}[BoardStateKey]; // This maps the BoardStateKey to its specific type

export interface BoardState {
  waiting: boolean;
  gameStarted: boolean;
  playingId: string | null;
  roomId: string | null;
  boardPos: BoardPos | null;
  playingAS: PlayingAS | null;
  selectedPiece: string | null;
  from: string | null;
  user: PlayerInfo;
  oponent: PlayerInfo;
  to: string | null;
  gameStatus: GameStatus;
  wonBy: WonBy | null;
}
