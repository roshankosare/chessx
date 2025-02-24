import { BoardPos, ChessBoard, PlayingAS } from "@/types";
import { create } from "zustand";

interface TilesStore {
  tiles: ChessBoard;
  selectPiece: (
    id: string,
    playingAs: PlayingAS | null,
    setCurrentPiece: (square: string | null) => void
  ) => void;
  setTiles: (boardPos: BoardPos) => void;
  reverseTiles: () => void;
  resetTiles: () => void;

  setPossibleMoves: (moves: string[]) => void;
}
const rows = 8;
const generateTileId = (row: number, col: number): string => {
  const letters = "abcdefgh";
  return `${letters[col]}${rows - row}`;
};


export const useTiles = create<TilesStore>((set) => ({
  tiles: Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 8); // 8 columns
    const col = index % 8;
    const isBlack = (row + col) % 2 === 1;

    return {
      id: generateTileId(row, col),
      color: isBlack ? "#034F0B" : "#DEFBE1",
      piece: null, // Start with no pieces
      selected: false,
    };
  }) as unknown as ChessBoard,
  selectPiece: (
    id: string,
    playingAs: PlayingAS | null,
    setCurrentPiece: (square: string | null) => void
  ) =>
    set((state) => {
      const tiles = state.tiles; // Keep reference
      tiles.forEach((tile) => {
        if (tile.id === id && playingAs) {
          const isSelectable =
            tile.piece &&
            ((playingAs === "w" && tile.piece.color === "w") ||
              (playingAs === "b" && tile.piece.color === "b"));

          tile.selected = isSelectable ? !tile.selected : false;
          setCurrentPiece(tile.id);
        } else {
          tile.selected = false;
        }
      });
      return { ...state, tiles }; // Ensure state object updates
    }),
  setTiles: (boarPos: BoardPos) =>
    set((state) => {
      if (!boarPos) return state;

      const tiles = state.tiles; // Keep the reference stable
      tiles.forEach((tile, index) => {
        const posElement = boarPos[index];
        tile.piece = posElement ? posElement.piece : null;
      });

      return { ...state, tiles }; // Ensure React detects the state change
    }),

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
    set((state) => {
      const tiles = state.tiles; // Keep the reference stable
      tiles.forEach((tile) => {
        tile.selected = moves.includes(tile.id);
      });

      return { ...state, tiles }; // Ensure React detects the state update
    }),
  resetTiles: () =>
    set({
      tiles: Array.from({ length: 64 }, (_, index) => {
        const row = Math.floor(index / 8); // 8 columns
        const col = index % 8;
        const isBlack = (row + col) % 2 === 1;

        return {
          id: generateTileId(row, col),
          color: isBlack ? "#034F0B" : "#DEFBE1",
          piece: null, // Start with no pieces
          selected: false,
        };
      }) as unknown as ChessBoard,
    }),
}));
