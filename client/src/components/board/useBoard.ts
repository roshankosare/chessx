import { BoardState, BoardStateKey } from "@/types";
import { create } from "zustand";

export const useBoard = create<{
  boardState: BoardState;
  setBoardState: <K extends BoardStateKey>(
    key: K,
    value: BoardState[K] | ((prevValue: BoardState[K]) => BoardState[K])
  ) => void;
  resetBoardState: () => void;
}>((set) => ({
  boardState: {
    gameTime: 3,
    waiting: false,
    gameStarted: false,
    playingId: null,
    roomId: null,
    boardPos: null,
    playingAS: null,
    selectedPiece: null,
    from: null,
    user: { username: null, avatar: null, remainingTime: null },
    oponent: { username: null, avatar: null, remainingTime: null },
    to: null,
    gameStatus: "ready",
    wonBy: null,
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
        gameStarted: false,
        playingId: null,
        roomId: null,
        boardPos: null,
        playingAS: null,
        selectedPiece: null,
        from: null,
        user: { username: null, avatar: null, remainingTime: null },
        oponent: { username: null, avatar: null, remainingTime: null },
        to: null,
        gameStatus: "ready",
        wonBy: null,
      },
    })),
}));
