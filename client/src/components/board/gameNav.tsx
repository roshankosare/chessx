import React, { useEffect, useState } from "react";
import { useBoard } from "./useBoard";
import { Button } from "../ui/button";
import SelectTime from "./selectTime";
import { GameTime } from "../../types";
import GameOver from "./gameOver";
import ResignGame from "./resignGame";
import { useGameIo } from "./useGameIo";
import { useGame } from "./useGame";
import { ArrowLeftCircleIcon } from "lucide-react";

const GameNav = () => {
  const [openGameOverWindow, setOpenGameOverWindow] = useState<boolean>(false);
  const [openResignGame, setOpenResignGame] = useState<boolean>(false);
  const gameStatus = useBoard((state) => state.boardState.gameStatus);
  const { startNewGame, resignGame } = useGameIo();
  const [showGameSlection, setShowGameSlection] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const gameStarted = useBoard((state) => state.boardState.gameStarted);
  const waiting = useBoard((state) => state.boardState.waiting);
  useGame();
  useEffect(() => {
    if (gameStatus !== "ready") {
      setOpenGameOverWindow(true);
    }
  }, [gameStatus]);
  return (
    <div className="flex  flex-col sm:gap-y-5  justify-center gap-x-4 gap-y-5 px-8">
      {!waiting && gameStarted && start ? (
        <Button
          className=" sm:w-[300px]  w-full h-[70px] sm:h-[80px] bg-green-800 flex shadow-sm shadow-white  gap-y-4  rounded-3xl"
          onClick={() => {
            setOpenResignGame(true);
            // setStart();
            // endGame();
          }}
        >
          <p className="sm:text-3xl text-2xl sm:font-extrabold font-bold">
            Resign Game
          </p>
        </Button>
      ) : showGameSlection ? (
        <GameSlectionTab
          setStart={() => setStart(true)}
          startNewGame={() => startNewGame()}
          closeGameSelection={() => setShowGameSlection(false)}
        />
      ) : (
        <>
          <Button
            className=" sm:w-[300px]  w-full h-[70px] sm:h-[80px] bg-green-800 flex shadow-sm shadow-white  gap-y-4  rounded-3xl"
            onClick={() => {
              setShowGameSlection(true);
            }}
          >
            <div className="w-full h-full flex flex-row gap-x-4 justify-start px-4">
              <img src="/pawn-logo.png" className="h-[45px] my-auto" />
              <div className="flex flex-col gap-y-2 my-auto">
                <p className="sm:text-3xl text-2xl sm:font-extrabold font-bold">
                  Play Online
                </p>
              </div>
            </div>
          </Button>
          <Button
            className=" sm:w-[300px] w-full h-[70px] sm:h-[80px] bg-zinc-800 flex  gap-y-4 shadow-sm shadow-white  rounded-3xl"
            onClick={() => {
              setStart(true);
              startNewGame();
            }}
          >
            <div className="w-full px-4 h-full flex flex-row gap-x-4 justify-start">
              <img src="/bot-logo.png" className="h-[45px] my-auto" />
              <div className="flex flex-col gap-y-2 my-auto">
                <p className="sm:text-3xl text-2xl sm:font-extrabold font-bold">
                  Play Bot
                </p>
              </div>
            </div>
          </Button>

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
        setStart={(value: boolean) => setStart(value)}
        startNewGame={() => startNewGame()}
        openGameOverWindow={openGameOverWindow}
        onOpenChange={() => {
          setOpenGameOverWindow(false);
        }}
      />
    </div>
  );
};

type GameSlectionTabProps = {
  setStart: () => void;
  startNewGame: () => void;
  closeGameSelection: () => void;
};
export const GameSlectionTab: React.FC<GameSlectionTabProps> = ({
  setStart,
  startNewGame,
  closeGameSelection,
}) => {
  const gameTime = useBoard((state) => state.boardState.gameTime);
  const setBoardState = useBoard((state) => state.setBoardState);
  return (
    <div className="bg-zinc-800 px-5 py-5 flex flex-col gap-y-5 w-full h-full">
      <div className=" flex  justify-end w-full h-[40px]">
        <ArrowLeftCircleIcon
          className="w-[30px] h-[30px]"
          onClick={() => closeGameSelection()}
        />
      </div>
      <SelectTime
        time={gameTime}
        setTime={(time: number) => {
          setBoardState("gameTime", time as GameTime);
        }}
      />
      <Button
        className=" sm:w-[300px]  w-full h-[60px] bg-green-800 flex gap-y-4 shadow-sm shadow-white  rounded-xl"
        onClick={() => {
          setStart();
          startNewGame();
        }}
      >
        <p className="sm:text-2xl text-2xl sm:font-extrabold font-bold">Play</p>
      </Button>
    </div>
  );
};

export default GameNav;
