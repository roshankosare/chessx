import React, { useEffect, useState } from "react";
import { useBoard } from "./hooks/useBoard";
import { Button } from "../ui/button";
import SelectTime from "./selectTime";
import { GameTime } from "../../types";
import GameOver from "./gameOver";
import ResignGame from "./resignGame";
import { useGameIo } from "./hooks/useGameIo";
import { useGame } from "./hooks/useGame";
import { ArrowLeftCircleIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { getPieceImage } from "@/lib/chess";
import SelectPromotionPiece from "./selectPromotionPiece";

const GameNav = () => {
  const [openGameOverWindow, setOpenGameOverWindow] = useState<boolean>(false);
  const [openResignGame, setOpenResignGame] = useState<boolean>(false);
  const gameStatus = useBoard((state) => state.boardState.gameStatus);
  const { startNewGame, resignGame } = useGameIo();
  const [showGameSelection, setShowGameSelection] = useState<boolean>(false);
  const [showBotGameSelection, setShowBotGameSelection] =
    useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const gameStarted = useBoard((state) => state.boardState.gameStarted);
  const waiting = useBoard((state) => state.boardState.waiting);
  const moveHistory = useBoard((state) => state.boardState.moveHistory);
  const showPomotionWindow = useBoard(
    (state) => state.boardState.showPomotionWindow
  );
  const setBoardStateValue = useBoard((state) => state.setBoardStateValue);
  useGame();
  useEffect(() => {
    if (gameStatus !== "ready") {
      setOpenGameOverWindow(true);
    }
  }, [gameStatus]);
  return (
    <div className="flex  flex-col w-full sm:max-w-[400px] h-full  sm:gap-y-5  justify-center gap-x-4 gap-y-5 px-8">
      {!waiting && gameStarted && start && (
        <div className="w-full  flex flex-col bg-zinc-800">
          <div className="w-full h-[300px] overflow-y-scroll  scrollbar-hide [&::-webkit-scrollbar]:hidden px-2">
            <p className="w-full h-8 bg-zinc-800 text-center font-bold">
              Moves
            </p>
            <Table className="w-full  ">
              <TableBody>
                {moveHistory.map((move, index) => (
                  <TableRow
                    className={`${
                      index % 2 == 0 ? "bg-zinc-900" : ""
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
          <div className="flex justify-center gap-x-4">
            <Button
              size={"sm"}
              className="px-4 py-2 items-center my-2 w-[120px]"
              onClick={() => {
                setOpenResignGame(true);
                // setStart();
                // endGame();
              }}
            >
              <p className="text-sm">Resign Game</p>
            </Button>
            <Button
              size={"sm"}
              className="px-4 py-2 items-center my-2 w-[120px]"
              onClick={() => {
                // setOpenResignGame(true);
                // setStart();
                // endGame();
              }}
            >
              <p className="text-sm">Draw</p>
            </Button>
          </div>
        </div>
      )}
      {showGameSelection && !showBotGameSelection && (
        <GameSelectionTab
          setStart={() => setStart(true)}
          startNewGame={() => startNewGame()}
          closeGameSelection={() => setShowGameSelection(false)}
        />
      )}
      {!showGameSelection && showBotGameSelection && (
        <BotGameSelection
          setStart={() => setStart(true)}
          startNewGame={() => startNewGame()}
          closeBotGameSelection={() => setShowBotGameSelection(false)}
        />
      )}

      {!showBotGameSelection && !showGameSelection && !start && (
        <>
          <Button
            className=" sm:w-[300px] hover:bg-green-700  w-full h-[70px] sm:h-[80px] bg-green-800 flex shadow-sm shadow-white  gap-y-4  rounded-3xl"
            onClick={() => {
              setBoardStateValue({matchType:"H"})
              setShowGameSelection(true);
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
              setBoardStateValue({ matchType: "M" });
              setShowBotGameSelection(true);
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
      <SelectPromotionPiece
        show={showPomotionWindow}
        close={() =>
          setBoardStateValue({
            showPomotionWindow: false,
          })
        }
      />
    </div>
  );
};

type GameSlectionTabProps = {
  setStart: () => void;
  startNewGame: () => void;
  closeGameSelection: () => void;
};
export const GameSelectionTab: React.FC<GameSlectionTabProps> = ({
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
        className=" sm:w-[300px]  w-full h-[60px] hover:bg-green-700 bg-green-800 flex gap-y-4 shadow-sm shadow-white  rounded-xl"
        onClick={() => {
          setStart();
          startNewGame();
          closeGameSelection();
        }}
      >
        <p className="sm:text-2xl text-2xl sm:font-extrabold font-bold">Play</p>
      </Button>
    </div>
  );
};

type BotGameSelectionTabProps = {
  setStart: () => void;
  startNewGame: () => void;
  closeBotGameSelection: () => void;
};
export const BotGameSelection: React.FC<BotGameSelectionTabProps> = ({
  setStart,
  startNewGame,
  closeBotGameSelection,
}) => {
  const diLevel = useBoard((state) => state.boardState.diLevel);
  const setBoardStateValue = useBoard((state) => state.setBoardStateValue);
  const [showSelectDl, setShowSelectDl] = useState<boolean>(false);
  return (
    <div className="bg-zinc-800 px-5 py-5 flex flex-col gap-y-5 w-full h-full max-w-[400px]">
      <div className=" flex  justify-end w-full h-[40px]">
        <ArrowLeftCircleIcon
          className="w-[30px] h-[30px]"
          onClick={() => closeBotGameSelection()}
        />
      </div>
      <div className="flex flex-col px-2 py-4 gap-y-5">
        <Button
          className="w-full h-[60px] rounded-md flex justify-center gap-x-2 font-bold text-lg"
          onClick={() => setShowSelectDl(true)}
        >
          {diLevel === 10
            ? "Beginner"
            : diLevel === 15
              ? "Intermediate"
              : diLevel === 20
                ? "expert"
                : "Grandmaster"}
        </Button>
        {showSelectDl && (
          <div className="flex flex-wrap justify-center gap-y-4 gap-x-2">
            <Button
              className="w-[120px] py-2"
              onClick={() => {
                setBoardStateValue({ diLevel: 10 });
                setShowSelectDl(false);
              }}
            >
              Beginner
            </Button>
            <Button
              className="w-[120px] py-2"
              onClick={() => {
                setBoardStateValue({ diLevel: 15 });
                setShowSelectDl(false);
              }}
            >
              Intermediate
            </Button>
            <Button
              className="w-[120px] py-2"
              onClick={() => {
                setBoardStateValue({ diLevel: 20 });
                setShowSelectDl(false);
              }}
            >
              Expert
            </Button>
            <Button
              className="w-[120px] py-2"
              onClick={() => {
                setBoardStateValue({ diLevel: 25 });
                setShowSelectDl(false);
              }}
            >
              Grandmaster
            </Button>
          </div>
        )}
      </div>

      <Button
        className=" sm:w-[300px]  w-full h-[60px] hover:bg-green-700 bg-green-800 flex gap-y-4 shadow-sm shadow-white  rounded-xl"
        onClick={() => {
          setStart();
          startNewGame();
          closeBotGameSelection();
        }}
      >
        <p className="sm:text-2xl text-2xl sm:font-extrabold font-bold">Play</p>
      </Button>
    </div>
  );
};

export default GameNav;
