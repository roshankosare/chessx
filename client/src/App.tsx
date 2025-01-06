import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import Board from "./components/board/board";
import { useBoard } from "./components/board/useBoard";
import { useGame } from "./components/board/useGame";
import SelectTime from "./components/board/selectTime";
import PlayerInfo from "./components/board/playerInfo";
import GameOver from "./components/board/gameOver";

function App() {
  const [start, setStart] = useState<boolean>(false);
  const [time, setTime] = useState<number>(5);
  const [openGameOverWindow, setOpenGameOverWindow] = useState<boolean>(false);
  const { boardState, resetBoardState } = useBoard();
  const { startNewGame, endGame } = useGame();

  useEffect(() => {
    if (boardState.gameStatus !== "ready") {
      setOpenGameOverWindow(true);
    }
  }, [boardState.gameStatus]);

  // Establish the connection with the socket server

  // console.log(boardState.from, boardState.to);
  // console.log(boardState.selectedPiece);

  return (
    <div className="w-full  h-screen px-5 py-5 flex flex-col gap-y-5 bg-neutral-700 ">
      <div className="max-w-[800px] mx-auto bg-neutral-800 px-10  text-white flex flex-col gap-y-5 py-5 rounded-lg shadow-lg">
        {boardState.gameStarted ? (
          <div className="w-full h-full flex flex-col gap-y-2">
            <PlayerInfo
              type="o"
              username={boardState.oponent.username || undefined}
              remainingTime={boardState.oponent.remainingTime || undefined}
              playingAS={boardState.playingAS || undefined}
            />
            <Board size={500}></Board>
            <PlayerInfo
              type="p"
              username={boardState.user.username || undefined}
              remainingTime={boardState.user.remainingTime || undefined}
              playingAS={boardState.playingAS || undefined}
            />
          </div>
        ) : (
          // <></>
          <div className="w-[500px] h-[500px] mx-auto my-auto relative">
            {boardState.waiting && !boardState.gameStarted && (
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
                time={time}
                setTime={(time: number) => {
                  setTime(time);
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
          boardState.gameStatus === "whiteWins" && boardState.playingAS === "w"
            ? "you won"
            : boardState.gameStatus === "blackWins" &&
              boardState.playingAS === "b"
            ? "you won"
            : boardState.gameStatus === "draw"
            ? "draw"
            : boardState.gameStatus === "stalemate"
            ? "stalemate"
            : "opponent won"
        }
        message={boardState.wonBy || ""}
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
