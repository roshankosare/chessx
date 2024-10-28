import { BoardState, BoardStateKey } from "@/types";
import { create } from "zustand";

export const useBoard = create<{
  boardState: BoardState;
  setBoardState: <K extends BoardStateKey>(
    key: K,
    value: BoardState[K]
  ) => void;
}>((set) => ({
  boardState: {
    waiting: false,
    gameStarted: false,
    playingId: null,
    roomId: null,
    boardPos: null,
    playingAS: null,
    selectedPiece: null,
    from:null,
    to:null
  },

  setBoardState: (key, value) =>
    set((state) => ({
      boardState: {
        ...state.boardState, // Correctly spreading the existing boardState
        [key]: value, // Updating the specific key
      },
    })),
}));