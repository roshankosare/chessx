import { ArrowLeftCircleIcon } from "lucide-react";
import { useBoardStore } from "../../stores/useBoardStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type BotGameSelectionTabProps = {
    setStart: () => void;
    startNewGame: () => void;
    closeBotGameSelection: () => void;
  };
  export const BotGameSelectionTab: React.FC<BotGameSelectionTabProps> = ({
    setStart,
    startNewGame,
    closeBotGameSelection,
  }) => {
    const diLevel = useBoardStore((state) => state.boardState.diLevel);
    const setBoardStateValue = useBoardStore((state) => state.setBoardStateValue);
    const [showSelectDl, setShowSelectDl] = useState<boolean>(false);
    return (
      <div className="bg-zinc-800 px-5 py-5 flex flex-col gap-y-5 w-full h-full max-w-[400px]">
        <div className=" flex  justify-end w-full h-[40px]">
          <ArrowLeftCircleIcon
            className="w-[30px] h-[30px]"
            onClick={() => closeBotGameSelection()}
          />
        </div>
        <div className="flex flex-col px-2 py-4 gap-y-5">
          <Button
            className="w-full h-[60px] rounded-md flex justify-center gap-x-2 font-bold text-lg"
            onClick={() => setShowSelectDl(true)}
          >
            {diLevel === 10
              ? "Beginner"
              : diLevel === 15
                ? "Intermediate"
                : diLevel === 20
                  ? "expert"
                  : "Grandmaster"}
          </Button>
          {showSelectDl && (
            <div className="flex flex-wrap justify-center gap-y-4 gap-x-2">
              <Button
                className="w-[120px] py-2"
                onClick={() => {
                  setBoardStateValue({ diLevel: 10 });
                  setShowSelectDl(false);
                }}
              >
                Beginner
              </Button>
              <Button
                className="w-[120px] py-2"
                onClick={() => {
                  setBoardStateValue({ diLevel: 15 });
                  setShowSelectDl(false);
                }}
              >
                Intermediate
              </Button>
              <Button
                className="w-[120px] py-2"
                onClick={() => {
                  setBoardStateValue({ diLevel: 20 });
                  setShowSelectDl(false);
                }}
              >
                Expert
              </Button>
              <Button
                className="w-[120px] py-2"
                onClick={() => {
                  setBoardStateValue({ diLevel: 25 });
                  setShowSelectDl(false);
                }}
              >
                Grandmaster
              </Button>
            </div>
          )}
        </div>
  
        <Button
          className=" sm:w-[300px]  w-full h-[60px] hover:bg-green-700 bg-green-800 flex gap-y-4 shadow-sm shadow-white  rounded-xl"
          onClick={() => {
            setStart();
            startNewGame();
            closeBotGameSelection();
          }}
        >
          <p className="sm:text-2xl text-2xl sm:font-extrabold font-bold">Play</p>
        </Button>
      </div>
    );
  };