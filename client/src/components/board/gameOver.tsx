import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoard } from "./useBoard";
import { Button } from "../ui/button";

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
  const resetBoardState = useBoard((state) => state.resetBoardState);

  const user = useBoard((state) => state.boardState.playersInfo.user);
  const opponent = useBoard((state) => state.boardState.playersInfo.opponent);
  const playingAs = useBoard((state) => state.boardState.playingAS);
  const gameStatus = useBoard((state) => state.boardState.gameStatus);
  const wonBy = useBoard((state) => state.boardState.wonBy);
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
        resetBoardState();
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
