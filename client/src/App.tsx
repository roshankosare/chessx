import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useBoard } from "./components/board/useBoard";
import GameNav from "./components/board/gameNav";
import GameWindow from "./components/board/gameWindow";
import { useRenderCount } from "./components/board/useRenderCount";

function App() {
  const [start, setStart] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState<number>(500);

  const gameStarted = useBoard((state) => state.boardState.gameStarted);
  const waiting = useBoard((state) => state.boardState.waiting);

  useRenderCount();
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
          <GameWindow size={boardSize} />
        ) : (
          // <></>
          <div className=" w-full px-2  h-auto sm:w-[500px] sm:h-[500px] mx-auto my-auto relative">
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
        <GameNav start={start} setStart={(value:boolean) => setStart(value)} />
      </div>
    </div>
  );
}

export default App;
