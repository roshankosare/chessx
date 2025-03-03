import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useBoardStore } from "./modules/game/stores/useBoardStore";
import GameNav from "./modules/game/components/gameNav";
import GameWindow from "./modules/game/components/gameWindow";
import NavBar from "./components/NavBar";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState<number>(500);

  const gameStarted = useBoardStore((state) => state.boardState.gameStarted);
  const waiting = useBoardStore((state) => state.boardState.waiting);

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
    <div className="w-full h-screen  overflow-x-scroll flex flex-col gap-y-5 bg-neutral-900 ">
      <NavBar />
      <div
        ref={containerRef}
        className=" w-full h-auto sm:max-w-[1200px]  mx-auto sm:px-10  text-white flex  flex-col justify-center sm:flex-row gap-y-5 py-5 sm:gap-x-5"
      >
        {gameStarted ? (
          <GameWindow size={boardSize} />
        ) : (
          // <></>
          <div className=" w-full px-2  h-auto sm:w-[500px] sm:h-[500px] my-auto relative">
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
        <GameNav />
      </div>
    </div>
  );
}

export default App;
