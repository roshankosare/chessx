import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import Board from "./components/board/board";
import { useBoard } from "./components/board/useBoard";
import { useGame } from "./components/board/useGame";
import SelectTime from "./components/board/selectTime";
import PlayerInfo from "./components/board/playerInfo";
import GameOver from "./components/board/gameOver";
import { GameTime } from "./types";

function App() {
  const [start, setStart] = useState<boolean>(false);
  const [openGameOverWindow, setOpenGameOverWindow] = useState<boolean>(false);

  const { startNewGame, endGame } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState<number>(500);

  const setBoardState = useBoard((state) => state.setBoardState);
  const resetBoardState = useBoard((state) => state.resetBoardState);
  const opponentUsername = useBoard(
    (state) => state.boardState.playersInfo.opponent.username
  );
  const userUsername = useBoard(
    (state) => state.boardState.playersInfo.user.username
  );
  const gameStatus = useBoard((state) => state.boardState.gameStatus);
  const gameStarted = useBoard((state) => state.boardState.gameStarted);
  const wonBy = useBoard((state) => state.boardState.wonBy);
  const waiting = useBoard((state) => state.boardState.waiting);
  const playingAs = useBoard((state) => state.boardState.playingAS);
  const gameTime = useBoard((state) => state.boardState.gameTime);

  useEffect(() => {
    if (gameStatus !== "ready") {
      setOpenGameOverWindow(true);
    }
  }, [gameStatus]);
  useEffect(() => {
    const container = containerRef.current; // Capture the ref value in a variable

    const updateSize = () => {
      if (container) {
        const { width } = container.getBoundingClientRect();
        setBoardSize(width);
      }
    };

    updateSize(); // Initial size calculation

    // Create ResizeObserver and observe the container
    const observer = new ResizeObserver(updateSize);
    if (container) observer.observe(container);

    // Cleanup function
    return () => {
      if (container) observer.unobserve(container);
    };
  }, []);

  // Establish the connection with the socket server

  // console.log(boardState.from, boardState.to);
  // console.log(boardState.selectedPiece);

  return (
    <div className="w-full  h-screen sm:px-5 sm:py-5 flex flex-col gap-y-5 bg-neutral-700 ">
      <div
        ref={containerRef}
        className=" w-full sm:max-w-[800px] mx-auto bg-neutral-800 sm:px-10  text-white flex flex-col gap-y-5 py-5 rounded-lg shadow-lg"
      >
        {gameStarted ? (
          <div className="w-full h-full flex flex-col gap-y-2">
            <PlayerInfo
              type="o"
              username={opponentUsername || undefined}
              playingAS={playingAs || undefined}
            />
            <Board size={boardSize}></Board>
            <PlayerInfo
              type="p"
              username={userUsername || undefined}
              playingAS={playingAs || undefined}
            />
          </div>
        ) : (
          // <></>
          <div className=" w-full h-auto sm:w-[500px] sm:h-[500px] mx-auto my-auto relative">
            {waiting && !gameStarted && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-20 h-20 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              className="w-full h-full"
              src="/chess-image.png"
              alt="Chess board"
            />
          </div>
        )}
        <div className="flex flex-row justify-center gap-x-4">
          {start ? (
            <Button
              className="text-lg font-bold"
              onClick={() => {
                setStart(false);
                endGame();
              }}
            >
              Exit
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
                Play Bot
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
        </div>
      </div>
      <GameOver
        openGameOverWindow={openGameOverWindow}
        playerWon={
          gameStatus === "whiteWins" && playingAs === "w"
            ? "you won"
            : gameStatus === "blackWins" && playingAs === "b"
            ? "you won"
            : gameStatus === "draw"
            ? "draw"
            : gameStatus === "stalemate"
            ? "stalemate"
            : "opponent won"
        }
        message={wonBy || ""}
        onOpenChange={() => {
          setOpenGameOverWindow(false);
          resetBoardState();
          setStart(false);
        }}
      />
    </div>
  );
}

export default App;
