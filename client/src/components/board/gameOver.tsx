import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GameOverProps = {
  playerWon: string;
  message: string;
  openGameOverWindow: boolean;
  onOpenChange: () => void;
};

const GameOver: React.FC<GameOverProps> = ({
  playerWon,
  message,
  openGameOverWindow,
  onOpenChange,
}) => {
  return (
    <Dialog open={openGameOverWindow} onOpenChange={() => onOpenChange()}>
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
