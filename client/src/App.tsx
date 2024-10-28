import {useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import Board from "./components/board/board";
import { useBoard } from "./components/board/useBoard";
import { useGame } from "./components/board/useGame";

function App() {
  const [start, setStart] = useState<boolean>(false);
  const { boardState } = useBoard();
  const { startNewGame, endGame } = useGame();

  // Establish the connection with the socket server

  // console.log(boardState.from, boardState.to);
  // console.log(boardState.selectedPiece);

  return (
    <div className=" h-auto px-5 py-5 flex flex-col gap-y-5 w-full sm:max-w-[800px] ">
      {boardState.gameStarted ? (
        <Board size={500}></Board>
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
              className="text-lg font-bold"
              onClick={() => {
                setStart(true);
                startNewGame();
              }}
            >
              Play Bot
            </Button>
            {/* <Button className="text-lg font-bold">Play Random</Button> */}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
