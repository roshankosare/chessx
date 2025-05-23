import { BoardState, BoardStateKey } from "@/types";
import { create } from "zustand";

export const useBoardStore = create<{
  boardState: BoardState;
  setBoardState: <K extends BoardStateKey>(
    key: K,
    value: BoardState[K] | ((prevValue: BoardState[K]) => BoardState[K])
  ) => void;
  resetBoardState: () => void;
  setBoardStateValue: (values: Partial<BoardState>) => void;
  getBoardStateValue: <K extends BoardStateKey>(key: K) => BoardState[K];
}>((set, get) => ({
  boardState: {
    gameTime: 3,
    start: false,
    waiting: false,
    gameStarted: false,
    playingId: null,
    roomId: null,
    boardPos: null,
    playingAS: null,
    selectedPiece: null,
    playersInfo: {
      user: { username: null, avatar: null, remainingTime: null },
      opponent: { username: null, avatar: null, remainingTime: null },
    },
    move: { from: null, to: null },
    gameStatus: "ready",
    wonBy: null,
    possibleMoves: [],
    whiteCapturedPieces: [],
    blackCapturedPieces: [],
    moveHistory: [],
    promotionalMoves: [],
    promotionPiece: null,
    showPomotionWindow: false,
    matchType: "H",
    diLevel: 10,
    lastMove: { from: null, to: null },
  },

  setBoardState: (key, value) =>
    set((state) => ({
      boardState: {
        ...state.boardState,
        [key]:
          typeof value === "function"
            ? (
                value as (
                  prevValue: BoardState[typeof key]
                ) => BoardState[typeof key]
              )(state.boardState[key])
            : value,
      },
    })),
  resetBoardState: () =>
    set((state) => ({
      boardState: {
        gameTime: state.boardState.gameTime,
        waiting: false,
        start: false,
        gameStarted: false,
        playingId: null,
        roomId: null,
        boardPos: null,
        playingAS: null,
        selectedPiece: null,
        playersInfo: {
          user: { username: null, avatar: null, remainingTime: null },
          opponent: { username: null, avatar: null, remainingTime: null },
        },
        move: { from: null, to: null },
        gameStatus: "ready",
        wonBy: null,
        possibleMoves: [],
        whiteCapturedPieces: [],
        blackCapturedPieces: [],
        moveHistory: [],
        promotionalMoves: [],
        promotionPiece: null,
        showPomotionWindow: false,
        matchType: "H",
        diLevel: 10,
        lastMove: { from: null, to: null },
      },
    })),
  setBoardStateValue: (values: Partial<BoardState>) =>
    set((state) => ({
      boardState: {
        ...state.boardState,
        ...values,
      },
    })),
  getBoardStateValue: (key) => get().boardState[key],
}));
