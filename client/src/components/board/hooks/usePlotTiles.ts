import { useEffect } from "react";
import { useBoard } from "./useBoard";
import { useTiles } from "./useTiles";
import { useShallow } from "zustand/shallow";

export const usePlotTiles = () => {
  const [reverseTiles, setPossibleMoves, setTiles, setLastMove] = useTiles(
    useShallow((state) => [
      state.reverseTiles,
      state.setPossibleMoves,
      state.setTiles,
      state.setLastMove,
    ])
  );

  const [playingAs, boardPos, possibleMoves, lastMove] = useBoard(
    useShallow((state) => [
      state.boardState.playingAS,
      state.boardState.boardPos,
      state.boardState.possibleMoves,
      state.boardState.lastMove,
    ])
  );

  useEffect(() => {
    if (playingAs == "b") {
      reverseTiles();
    }
  }, [playingAs, reverseTiles]);

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
