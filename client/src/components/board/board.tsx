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
      className="grid grid-cols-8 grid-rows-8 bg-amber-950 mx-auto my-auto rounded-md border-4 border-gray-800 p-4 gap-0"
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
