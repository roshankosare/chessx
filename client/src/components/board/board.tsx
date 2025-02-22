"use client";

import React from "react";
import PlotTiles from "./plotTiles";

interface BoardProps {
  size: number;
}

const Board: React.FC<BoardProps> = ({ size }) => {
  const width = size > 500 ? 500 : size;
  const height = size > 500 ? 500 : size;

  return (
    <div
      className="grid grid-cols-8 grid-rows-8 mx-auto my-auto p-4 gap-0"
      style={{
        width: width, // 100% width on mobile
        height: height, // 100% height on mobile
      }}
    >
      <PlotTiles />
    </div>
  );
};

export default Board;
