import React, { useEffect, useState } from "react";
import { useBoard } from "./useBoard";
import { Button } from "../ui/button";
import SelectTime from "./selectTime";
import { useGame } from "./useGame";
import { GameTime } from "../../types";
import GameOver from "./gameOver";
import ResignGame from "./resignGame";

type GameNavProps = {
  start: boolean;
  setStart: (value: boolean) => void;
};
const GameNav: React.FC<GameNavProps> = ({ start, setStart }) => {
  const gameTime = useBoard((state) => state.boardState.gameTime);
  const setBoardState = useBoard((state) => state.setBoardState);
  const [openGameOverWindow, setOpenGameOverWindow] = useState<boolean>(false);
  const [openResignGame, setOpenResignGame] = useState<boolean>(false);
  const gameStatus = useBoard((state) => state.boardState.gameStatus);
  const wonBy = useBoard((state) => state.boardState.wonBy);
  const { startNewGame, resignGame } = useGame();
  useEffect(() => {
    if (gameStatus !== "ready") {
      setOpenGameOverWindow(true);
    }
  }, [gameStatus]);
  return (
    <div className="flex flex-row justify-center gap-x-4">
      {start ? (
        <Button
          className="text-lg font-bold"
          onClick={() => {
            setOpenResignGame(true);
            // setStart();
            // endGame();
          }}
        >
          Resign
        </Button>
      ) : (
        <>
          <Button
            className="text-md font-bold"
            onClick={() => {
              setStart(true);
              startNewGame();
            }}
          >
            Play Random
          </Button>
          <SelectTime
            time={gameTime}
            setTime={(time: number) => {
              setBoardState("gameTime", time as GameTime);
            }}
          />{" "}
          {/* <Button className="text-lg font-bold">Play Random</Button> */}
        </>
      )}

      <ResignGame
        open={openResignGame}
        onOpenChange={() => {
          setOpenResignGame(false);
        }}
        resignGame={() => {
          resignGame();
          setOpenResignGame(false);
        }}
      />
      <GameOver
        setStart={() => setStart(false)}
        openGameOverWindow={openGameOverWindow}
        playerWon={
          gameStatus === "whiteWins"
            ? "White Win"
            : gameStatus === "blackWins"
            ? "Black win"
            : gameStatus === "draw"
            ? "Draw"
            : gameStatus === "stalemate"
            ? "Stalemate"
            : "Draw"
        }
        message={wonBy || ""}
        onOpenChange={() => {
          setOpenGameOverWindow(false);
        }}
      />
    </div>
  );
};

export default GameNav;
