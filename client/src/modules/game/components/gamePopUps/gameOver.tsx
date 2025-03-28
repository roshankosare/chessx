import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoardStore } from "../../stores/useBoardStore";
import { Button } from "../../../../components/ui/button";
import { useTilesStore } from "../../stores/useTilesStore";

type GameOverProps = {
  openGameOverWindow: boolean;
  onOpenChange: () => void;
  setStart: (value: boolean) => void;
  startNewGame: () => void;
};

const GameOver: React.FC<GameOverProps> = ({
  openGameOverWindow,
  onOpenChange,
  setStart,
  startNewGame,
}) => {
  const resetBoardState = useBoardStore((state) => state.resetBoardState);

  const user = useBoardStore((state) => state.boardState.playersInfo.user);
  const opponent = useBoardStore((state) => state.boardState.playersInfo.opponent);
  const playingAs = useBoardStore((state) => state.boardState.playingAS);
  const gameStatus = useBoardStore((state) => state.boardState.gameStatus);
  const wonBy = useBoardStore((state) => state.boardState.wonBy);
  const resetTiles = useTilesStore((state) => state.resetTiles);
  const playerWon =
    gameStatus === "whiteWins"
      ? "White Win"
      : gameStatus === "blackWins"
      ? "Black win"
      : gameStatus === "draw"
      ? "Draw"
      : gameStatus === "stalemate"
      ? "Stalemate"
      : "Draw";
  return (
    <Dialog
      open={openGameOverWindow}
      onOpenChange={() => {
        onOpenChange();
        setStart(false);
      }}
    >
      <DialogContent className="sm:max-w-[425px]  flex flex-col gap-y-10 px-0 py-0 border-0 bg-neutral-800">
        <DialogHeader className=" px-2 py-2 bg-neutral-950  ">
          <DialogTitle className="font-bold text-3xl text-center text-white">
            {playerWon}
          </DialogTitle>
          <DialogDescription className="text-xl text-center ">
            by {wonBy}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row justify-center gap-x-12 my-10 ">
          <div className="flex flex-col text-center  ">
            <div className="border-4 rounded-lg border-white p-2 bg-slate-500 ">
              <img src="/pawn-logo.png" className="w-[70px] h-auto " />
            </div>
            <p className="font-bold text-white ">
              {playingAs === "w" ? user.username : opponent.username}
            </p>
          </div>

          <div className="flex flex-col text-center  ">
            <div className="border-4 rounded-lg border-white p-2  bg-slate-500 ">
              <img src="/black-pawn-logo.png" className="w-[70px] h-auto " />
            </div>

            <p className="font-bold text-white">
              {playingAs === "b" ? user.username : opponent.username}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-around mb-10">
          <Button
            onClick={() => {
              resetBoardState();
              resetTiles();
              setStart(true);
              startNewGame();
              onOpenChange();
            }}
            className="w-[150px] h-[50px] font-bold text-lg bg-green-600"
          >
            New Game
          </Button>
          <Button
            onClick={() => {
              onOpenChange();
              resetTiles();
              resetBoardState();
              setStart(false);
            }}
            className="w-[150px] h-[50px] font-bold text-lg bg-green-600"
          >
            Home
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default GameOver;
