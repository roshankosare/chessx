import { BoardPos, BoardState, ChessBoard } from "@/types";
import { create } from "zustand";

interface TilesStore {
  tiles: ChessBoard;
  selectPiece: (
    id: string,
    boardState: BoardState,
    setCurrentPiece: (square: string | null) => void
  ) => void;
  setTiles: (boardPos: BoardPos) => void;
  reverseTiles: () => void;

  setPossibleMoves: (moves: string[]) => void;
}
const rows = 8;
const generateTileId = (row: number, col: number): string => {
  const letters = "abcdefgh";
  return `${letters[col]}${rows - row}`;
};

const boardPosToTileState = (
  boardPos: BoardPos,
  tileState: ChessBoard
): ChessBoard => {
  if (!boardPos) return boardPos; // In case board is null

  const updatedBoard = tileState.map((tile, index) => {
    const posElement = boardPos[index];

    if (posElement === null) {
      // If the BoardPosElement is null, leave the current board tile unchanged
      return {
        ...tile,
        piece: null,
      };
    }

    // If BoardPosElement is not null, update the corresponding tile
    return {
      ...tile,
      piece: posElement?.piece || null, // Update the piece from BoardPosElement
    };
  });

  return updatedBoard as unknown as ChessBoard;
};

export const useTiles = create<TilesStore>((set) => ({
  tiles: Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8); // 8 columns
    const col = index % 8;
    const isBlack = (row + col) % 2 === 1;

    return {
      id: generateTileId(row, col),
      color: isBlack ? "#663500" : "#ffe6cc",
      piece: null, // Start with no pieces
      selected: false,
    };
  }) as unknown as ChessBoard,
  selectPiece: (
    id: string,
    boardState: BoardState,
    setCurrentPiece: (square: string | null) => void
  ) =>
    set((state) => ({
      tiles: state.tiles.map((tile) => {
        if (tile.id == id) {
          const t = {
            ...tile,
            selected: tile.piece
              ? boardState.playingAS == "w" && tile.piece.color == "w"
                ? !tile.selected
                : boardState.playingAS == "b" && tile.piece.color == "b"
                ? !tile.selected
                : false
              : false,
          };
          setCurrentPiece(t.id);
          return t;
        }

        return { ...tile, selected: false };
      }) as unknown as ChessBoard,
    })),
  setTiles: (boarPos: BoardPos) =>
    set((state) => ({
      tiles: boardPosToTileState(boarPos, state.tiles),
    })),

  reverseTiles: () => {
    set((state) => ({
      tiles: Array.from({ length: 8 }, (_, i) =>
        state.tiles.slice(i * 8, i * 8 + 8).reverse()
      )
        .reverse()
        .flat() as unknown as ChessBoard,
    }));
  },

  setPossibleMoves: (moves: string[]) =>
    set((state) => ({
      tiles: state.tiles.map((tile) => {
        if (moves.includes(tile.id)) {
          return {
            ...tile,
            selected: true,
          };
        } else {
          return {
            ...tile,
            selected: false, // Optionally reset selected for non-matching tiles
          };
        }
      }) as unknown as ChessBoard,
    })),
}));
