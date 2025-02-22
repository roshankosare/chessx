import {  useEffect } from "react";
import { useBoard } from "./useBoard";
import { useTiles } from "./useTiles";
import { useShallow } from "zustand/shallow";

export const usePlotTiles = () => {
  const [reverseTiles, setPossibleMoves,setTiles] = useTiles(
    useShallow((state) => [
      state.reverseTiles,
      state.setPossibleMoves,
      state.setTiles,
    ])
  );

  const [playingAs, boardPos, possibleMoves] = useBoard(
    useShallow((state) => [
      state.boardState.playingAS,
      state.boardState.boardPos,
      state.boardState.possibleMoves,
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
};
