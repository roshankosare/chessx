import { useEffect } from "react";
import { useBoardStore } from "../stores/useBoardStore";
import { useTilesStore } from "../stores/useTilesStore";
import { useShallow } from "zustand/shallow";

export const usePlotTiles = () => {
  const [setPossibleMoves, setTiles, setLastMove, reverseTiles] = useTilesStore(
    useShallow((state) => [
      state.setPossibleMoves,
      state.setTiles,
      state.setLastMove,
      state.reverseTiles,
    ])
  );

  const [boardPos, possibleMoves, lastMove, playingAs] = useBoardStore(
    useShallow((state) => [
      state.boardState.boardPos,
      state.boardState.possibleMoves,
      state.boardState.lastMove,
      state.boardState.playingAS,
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
    if (playingAs == "b") {
      reverseTiles();
    }
  }, [playingAs, reverseTiles]);

  useEffect(() => {
    if (lastMove.from && lastMove.to) setLastMove([lastMove.from, lastMove.to]);
  }, [setLastMove, lastMove]);
};
