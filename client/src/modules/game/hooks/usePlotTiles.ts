import { useEffect } from "react";
import { useBoardStore } from "../stores/useBoardStore";
import { useTilesStore } from "../stores/useTilesStore";
import { useShallow } from "zustand/shallow";

export const usePlotTiles = () => {
  const [setPossibleMoves, setTiles, setLastMove] = useTilesStore(
    useShallow((state) => [
      state.setPossibleMoves,
      state.setTiles,
      state.setLastMove,
    ])
  );

  const [boardPos, possibleMoves, lastMove] = useBoardStore(
    useShallow((state) => [
      state.boardState.boardPos,
      state.boardState.possibleMoves,
      state.boardState.lastMove,
    ])
  );

  useEffect(() => {
    if (possibleMoves.length > 0) {
      setPossibleMoves([...possibleMoves]);
    }
  }, [setPossibleMoves, possibleMoves]);

  useEffect(() => {
    if (boardPos) {
      setTiles(boardPos);
    }
  }, [setTiles, boardPos]);

  useEffect(() => {
    if (lastMove.from && lastMove.to) setLastMove([lastMove.from, lastMove.to]);
  }, [setLastMove, lastMove]);
};
