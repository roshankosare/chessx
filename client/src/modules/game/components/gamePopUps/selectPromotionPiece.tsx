import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { useBoardStore } from "../../stores/useBoardStore";
import { getPieceImage } from "@/lib/chess";

type SelectPromotionPieceProps = {
  show: boolean;
  close: () => void;
};

const SelectPromotionPiece: React.FC<SelectPromotionPieceProps> = ({
  show,
}) => {
  const playingAs = useBoardStore((state) => state.boardState.playingAS);
  const setBoardStateValue = useBoardStore((state) => state.setBoardStateValue);
  return (
    <Dialog open={show} onOpenChange={() => close()}>
      <DialogContent className="sm:max-w-[425px] max-w-[250px] px-5 py-5 flex flex-col gap-y-4 rounded-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl mx-auto">
            Promote To
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap justify-center gap-x-8">
          <img
            src={getPieceImage(playingAs + "q")}
            onClick={() =>
              setBoardStateValue({
                promotionPiece: "q",
                showPomotionWindow: false,
              })
            }
            className="w-[50px] h-[50px]"
          />
          <img
            src={getPieceImage(playingAs + "r")}
            onClick={() =>
              setBoardStateValue({
                promotionPiece: "r",
                showPomotionWindow: false,
              })
            }
            className="w-[50px] h-[50px]"
          />
          <img
            src={getPieceImage(playingAs + "n")}
            onClick={() =>
              setBoardStateValue({
                promotionPiece: "n",
                showPomotionWindow: false,
              })
            }
            className="w-[50px] h-[50px]"
          />
          <img
            src={getPieceImage(playingAs + "b")}
            onClick={() =>
              setBoardStateValue({
                promotionPiece: "b",
                showPomotionWindow: false,
              })
            }
            className="w-[50px] h-[50px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPromotionPiece;
