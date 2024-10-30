"use client";

import React, { useEffect } from "react";
import Tile from "./tile";
import { useBoard } from "./useBoard";
import { useTiles } from "./useTiles";

interface BoardProps {
  size: number;
}

const Board: React.FC<BoardProps> = ({ size }) => {
  const width = size;
  const hight = size;

  const { tiles, setTiles, reverseTiles } = useTiles();
  const { boardState } = useBoard();
  useEffect(() => {
    if (boardState.boardPos) setTiles(boardState.boardPos);
  }, [boardState.boardPos, setTiles]);

  useEffect(() => {
    if (boardState.playingAS == "b") {
      reverseTiles();
    }
  }, [boardState.playingAS, reverseTiles]);

  return (
    <div
      className="grid grid-cols-8 grid-rows-8 bg-amber-950 mx-auto my-auto rounded-md border-4 border-gray-800 p-4 gap-0"
      style={{
        width: width,
        height: hight,
      }}
    >
      {tiles.map((t) => (
        <Tile
          key={t.id}
          color={t.color}
          piece={t.piece}
          selected={t.selected}
          id={t.id}
        />
      ))}
    </div>
  );
};

export default Board;
