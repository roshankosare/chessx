import React from "react";
import PlayerInfo from "./playerInfo";
import Board from "./board";
import RenderTiles from "./renderTiles";

type GameWindowProps = {
  size: number;
};

const GameWindow: React.FC<GameWindowProps> = ({ size }) => {
  return (
    <div className="w-full sm:max-w-[500px] h-full flex flex-col gap-y-2">
      <RenderTiles />
      <PlayerInfo type="o" />
      <Board size={size}></Board>
      <PlayerInfo type="p" />
    </div>
  );
};

export default GameWindow;
