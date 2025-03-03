import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../../components/ui/button";

type ResignGameProps = {
  open: boolean;
  onOpenChange: () => void;
  resignGame: () => void;
};

const ResignGame: React.FC<ResignGameProps> = ({
  open,
  onOpenChange,
  resignGame,
}) => {
  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className="sm:max-w-[425px] px-5 py-5 flex flex-col gap-y-4">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl mx-auto">
            Resign
          </DialogTitle>
          <DialogDescription className="mx-auto">
            Are You Sure?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-x-8">
          <Button onClick={() => resignGame()}>Resign</Button>
          <Button>No</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ResignGame;
