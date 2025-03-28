import { useEffect, useState } from "react";
import { useBoardStore } from "../../stores/useBoardStore";
import GameOver from "../gamePopUps/gameOver";
import ResignGame from "../gamePopUps/resignGame";
import { useGameIo } from "../../hooks/useGameIo";
import { useGame } from "../../hooks/useGame";
import SelectPromotionPiece from "../gamePopUps/selectPromotionPiece";
import MoveHistoryCard from "./moveHistory";
import { GameSelectionTab } from "./gameSelectionTab";
import { BotGameSelectionTab } from "./botGameSelectionTab";
import StartNav from "./startNav";
import ConnectionWaiting from "../gamePopUps/connectionWaiting";

const GameNav = () => {
  const [openGameOverWindow, setOpenGameOverWindow] = useState<boolean>(false);
  const [openResignGame, setOpenResignGame] = useState<boolean>(false);
  const gameStatus = useBoardStore((state) => state.boardState.gameStatus);
  const { startNewGame, resignGame } = useGameIo();
  const [showGameSelection, setShowGameSelection] = useState<boolean>(false);
  const [showBotGameSelection, setShowBotGameSelection] =
    useState<boolean>(false);
  const gameStarted = useBoardStore((state) => state.boardState.gameStarted);
  const waiting = useBoardStore((state) => state.boardState.waiting);
  const moveHistory = useBoardStore((state) => state.boardState.moveHistory);
  const start = useBoardStore((state) => state.boardState.start);
  const showPomotionWindow = useBoardStore(
    (state) => state.boardState.showPomotionWindow
  );
  const setBoardStateValue = useBoardStore((state) => state.setBoardStateValue);
  useGame();
  useEffect(() => {
    if (gameStatus !== "ready") {
      setOpenGameOverWindow(true);
    }
  }, [gameStatus]);

  return (
    <div className="flex  flex-col w-full sm:max-w-[400px] h-full  sm:gap-y-5  justify-center gap-x-4 gap-y-5 px-8">
      {!waiting && gameStarted && start && (
        <MoveHistoryCard
          setOpenResignGame={setOpenResignGame}
          moveHistory={moveHistory}
        />
      )}
      {showGameSelection && !showBotGameSelection && (
        <GameSelectionTab
          setStart={() => setBoardStateValue({start:true})}
          startNewGame={() => startNewGame()}
          closeGameSelection={() => setShowGameSelection(false)}
        />
      )}
      {!showGameSelection && showBotGameSelection && (
        <BotGameSelectionTab
          setStart={() => setBoardStateValue({start:true})}
          startNewGame={() => startNewGame()}
          closeBotGameSelection={() => setShowBotGameSelection(false)}
        />
      )}

      {!showBotGameSelection && !showGameSelection && !start && (
        <StartNav
          setShowBotGameSelection={setShowBotGameSelection}
          setShowGameSelection={setShowGameSelection}
          setMatchType={(value: "H" | "M") => {
            if (value === "H") {
              setBoardStateValue({ matchType: "H" });
            } else if (value === "M") {
              setBoardStateValue({ matchType: "M" });
            }
          }}
        />
      )}

      <ConnectionWaiting open={start && !waiting && !gameStarted} />

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
        setStart={(value: boolean) => setBoardStateValue({start:value})}
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

export default GameNav;
