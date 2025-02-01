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
      <DialogContent className="sm:max-w-[425px] px-5 py-5">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Game Over</DialogTitle>
          <DialogDescription className="text-xl">
            {playerWon} by {message}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default GameOver;
