import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoard } from "./useBoard";

type GameOverProps = {
  playerWon: string;
  message: string;
  openGameOverWindow: boolean;
  onOpenChange: () => void;
  setStart: () => void;
};

const GameOver: React.FC<GameOverProps> = ({
  playerWon,
  message,
  openGameOverWindow,
  onOpenChange,
  setStart,
}) => {
  const resetBoardState = useBoard((state) => state.resetBoardState);
  return (
    <Dialog
      open={openGameOverWindow}
      onOpenChange={() => {
        onOpenChange();
        resetBoardState();
        setStart();
      }}
    >
      <DialogContent className="sm:max-w-[425px]  flex flex-col gap-y-10 px-0 py-0 border-0">
        <DialogHeader className="bg-neutral-800 px-2 py-2 ">
          <DialogTitle className="font-bold text-3xl text-center text-white">
            {playerWon}
          </DialogTitle>
          <DialogDescription className="text-xl text-center ">
            by {message}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row justify-center gap-x-12 my-10">
          <div className="flex flex-col border-4 rounded-lg border-gray-600  p-2">
            <img src="/pawn-logo.png" className="w-[70px] h-auto  " />
          </div>

          <div className="flex flex-col border-4 rounded-lg border-gray-600 p-2">
            <img src="/black-pawn-logo.png" className="w-[70px] h-auto " />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default GameOver;
