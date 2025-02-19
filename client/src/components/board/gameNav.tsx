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
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { getPieceImage } from "@/lib/chess";

const GameNav = () => {
  const [openGameOverWindow, setOpenGameOverWindow] = useState<boolean>(false);
  const [openResignGame, setOpenResignGame] = useState<boolean>(false);
  const gameStatus = useBoard((state) => state.boardState.gameStatus);
  const { startNewGame, resignGame } = useGameIo();
  const [showGameSlection, setShowGameSlection] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const gameStarted = useBoard((state) => state.boardState.gameStarted);
  const waiting = useBoard((state) => state.boardState.waiting);
  const moveHistory = useBoard((state) => state.boardState.moveHistory);
  useGame();
  useEffect(() => {
    if (gameStatus !== "ready") {
      setOpenGameOverWindow(true);
    }
  }, [gameStatus]);
  return (
    <div className="flex  flex-col w-full sm:max-w-[400px] h-full  sm:gap-y-5  justify-center gap-x-4 gap-y-5 px-8">
      {!waiting && gameStarted && start ? (
        <div className="w-full  flex flex-col bg-zinc-800 py-2 px-2">
          <div className="w-full h-[300px] overflow-y-scroll px-2 py-2 scrollbar-hide [&::-webkit-scrollbar]:hidden">
            <p className="w-full h-8 bg-zinc-900 text-center">moves</p>
            <Table className="w-full ">
              <TableBody>
                {moveHistory.map((move, index) => (
                  <TableRow
                    className={`${
                      index % 2 == 0 ? "" : "bg-zinc-900"
                    } border-none`}
                    key={index}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {
                        <div className="flex flex-row gap-x-1">
                          <img
                            src={getPieceImage("w" + move[0][0])}
                            className="w-4 h-4 my-auto"
                          />
                          <p>{move[0].slice(1)}</p>
                        </div>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-x-1">
                        {move[1] && (
                          <img
                            src={getPieceImage("b" + move[1][0])}
                            className="w-4 h-4 my-auto"
                          />
                        )}
                        <p>{move[1]?.slice(1)}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            size={"sm"}
            className="px-2 py-6 items-center my-2 rounded-2xl "
            onClick={() => {
              setOpenResignGame(true);
              // setStart();
              // endGame();
            }}
          >
            <p className="text-xl font-bold ">Resign Game</p>
          </Button>
        </div>
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
    <div className="bg-zinc-800 px-5 py-5 flex flex-col gap-y-5 w-full h-full max-w-[400px]">
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
