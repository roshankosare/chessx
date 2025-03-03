import { BoardPos, PlayingAS, TileInterface } from "@/types";
import { create } from "zustand";

// interface TilesStore {
//   tiles: ChessBoard;
//   selectPiece: (
//     id: string,
//     playingAs: PlayingAS | null,
//     setCurrentPiece: (square: string | null) => void
//   ) => void;
//   setTiles: (boardPos: BoardPos) => void;
//   reverseTiles: () => void;
//   resetTiles: () => void;
//   setLastMove: (move: string[]) => void;

//   setPossibleMoves: (moves: string[]) => void;
// }
// const rows = 8;
// const generateTileId = (row: number, col: number): string => {
//   const letters = "abcdefgh";
//   return `${letters[col]}${rows - row}`;
// };

// export const useTilesStore = create<TilesStore>((set) => ({
//   tiles: Array.from({ length: 64 }, (_, index) => {
//     const row = Math.floor(index / 8); // 8 columns
//     const col = index % 8;
//     const isBlack = (row + col) % 2 === 1;

//     return {
//       id: generateTileId(row, col),
//       color: isBlack ? "#034F0B" : "#DEFBE1",
//       piece: null, // Start with no pieces
//       selected: false,
//       isLastMoveSquare: false,
//     } as TileInterface;
//   }) as unknown as ChessBoard,
//   selectPiece: (
//     id: string,
//     playingAs: PlayingAS | null,
//     setCurrentPiece: (square: string | null) => void
//   ) =>
//     set((state) => {
//       const tiles = state.tiles; // Keep reference
//       tiles.forEach((tile) => {
//         if (tile.id === id && playingAs) {
//           const isSelectable =
//             tile.piece &&
//             ((playingAs === "w" && tile.piece.color === "w") ||
//               (playingAs === "b" && tile.piece.color === "b"));

//           tile.selected = isSelectable ? !tile.selected : false;
//           setCurrentPiece(tile.id);
//         } else {
//           tile.selected = false;
//         }
//       });
//       return { ...state, tiles }; // Ensure state object updates
//     }),
//   setTiles: (boarPos: BoardPos) =>
//     set((state) => {
//       if (!boarPos) return state;

//       const tiles = state.tiles; // Keep the reference stable
//       tiles.forEach((tile, index) => {
//         const posElement = boarPos[index];
//         tile.piece = posElement ? posElement.piece : null;
//       });

//       return { ...state, tiles }; // Ensure React detects the state change
//     }),

//   reverseTiles: () => {
//     set((state) => ({
//       tiles: Array.from({ length: 8 }, (_, i) =>
//         state.tiles.slice(i * 8, i * 8 + 8).reverse()
//       )
//         .reverse()
//         .flat() as unknown as ChessBoard,
//     }));
//   },

//   setPossibleMoves: (moves: string[]) =>
//     set((state) => {
//       const tiles = state.tiles; // Keep the reference stable
//       tiles.forEach((tile) => {
//         tile.selected = moves.includes(tile.id);
//       });

//       return { ...state, tiles }; // Ensure React detects the state update
//     }),
//   resetTiles: () =>
//     set({
//       tiles: Array.from({ length: 64 }, (_, index) => {
//         const row = Math.floor(index / 8); // 8 columns
//         const col = index % 8;
//         const isBlack = (row + col) % 2 === 1;

//         return {
//           id: generateTileId(row, col),
//           color: isBlack ? "#034F0B" : "#DEFBE1",
//           piece: null, // Start with no pieces
//           selected: false,
//           isLastMoveSquare: false,
//         } as TileInterface;
//       }) as unknown as ChessBoard,
//     }),
//   setLastMove: (squares: string[]) =>
//     set((state) => {
//       const tiles = state.tiles;
//       tiles.forEach((tile) => {
//         tile.isLastMoveSquare = squares.includes(tile.id);
//       });

//       return { ...state, tiles };
//     }),
// }));

const createInitialTiles = (): Map<string, TileInterface> => {
  const board = new Map<string, TileInterface>();
  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const id = generateTileId(row, col);
    board.set(id, {
      id,
      color: (row + col) % 2 === 1 ? "#034F0B" : "#DEFBE1",
      piece: null,
      selected: false,
      isLastMoveSquare: false,
    });
  }
  return board;
};

interface TilesStore {
  tiles: Map<string, TileInterface>;
  possibleMoves: Set<string>;
  lastMoveSquares: Set<string>;
  selectPiece: (
    id: string,
    playingAs: PlayingAS | null,
    setCurrentPiece: (square: string | null) => void
  ) => void;
  setTiles: (boardPos: BoardPos) => void;
  // reverseTiles: () => void;
  resetTiles: () => void;
  setLastMove: (move: string[]) => void;

  setPossibleMoves: (moves: string[]) => void;
}
const rows = 8;
const generateTileId = (row: number, col: number): string => {
  const letters = "abcdefgh";
  return `${letters[col]}${rows - row}`;
};

export const useTilesStore = create<TilesStore>((set) => ({
  tiles: createInitialTiles(),
  possibleMoves: new Set(),
  lastMoveSquares: new Set(),
  selectPiece: (
    id: string,
    playingAs: PlayingAS | null,
    setCurrentPiece: (square: string | null) => void
  ) =>
    set((state) => {
      const tiles = state.tiles; // Keep reference
      state.possibleMoves.forEach((id) => {
        const tile = tiles.get(id);
        if (tile) {
          tile.selected = false;
        }
      });

      const selectedTile = tiles.get(id);
      if (selectedTile && playingAs) {
        const isSelectable =
          selectedTile.piece &&
          ((playingAs === "w" && selectedTile.piece.color === "w") ||
            (playingAs === "b" && selectedTile.piece.color === "b"));

        selectedTile.selected = isSelectable ? !selectedTile.selected : false;
        setCurrentPiece(selectedTile.id);
      }
      return { ...state, tiles }; // Ensure state object updates
    }),
  setTiles: (boardPos: BoardPos) =>
    set((state) => {
      if (!boardPos) return state;
      const tiles = state.tiles;

      // create map for board position for o(1) access insted of array.find()
      const newPos = new Map(
        boardPos.filter(Boolean).map((tile) => [tile?.square, tile?.piece])
      );

      tiles.forEach((tile) => {
        const t = newPos.get(tile.id);
        if (t) {
          tile.piece = t;
        } else {
          tile.piece = null;
        }
      });

      return { ...state, tiles }; // Ensure React detects the state change
    }),
  setPossibleMoves: (moves: string[]) =>
    set((state) => {
      const tiles = state.tiles;
      const possibleMoves = state.possibleMoves; // Keep the reference stable
      possibleMoves.forEach((m) => {
        const tile = tiles.get(m);
        if (tile) {
          tile.selected = false;
        }
      });
      possibleMoves.clear();
      moves.map((m) => {
        const tile = tiles.get(m);
        if (tile) {
          tile.selected = true;
          possibleMoves.add(m);
        }
      });

      return { ...state, tiles, possibleMoves }; // Ensure React detects the state update
    }),
  resetTiles: () =>
    set({
      tiles: createInitialTiles(),
    }),
  setLastMove: (squares: string[]) =>
    set((state) => {
      const tiles = state.tiles;
      const previousMoves = state.lastMoveSquares;
      previousMoves.forEach((m) => {
        const tile = tiles.get(m);
        if (tile) {
          tile.isLastMoveSquare = false;
        }
      });
      previousMoves.clear();
      squares.map((m) => {
        const tile = tiles.get(m);
        if (tile) {
          tile.isLastMoveSquare = true;
          previousMoves.add(m);
        }
      });

      return { ...state, tiles };
    }),
}));
