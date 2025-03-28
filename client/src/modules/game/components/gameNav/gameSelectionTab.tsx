import { ArrowLeftCircleIcon } from "lucide-react";
import { useBoardStore } from "../../stores/useBoardStore";
import SelectTime from "../selectTime";
import { Button } from "@/components/ui/button";
import { GameTime } from "@/types";

type GameSelectionTabProps = {
    setStart: () => void;
    startNewGame: () => void;
    closeGameSelection: () => void;
  };
  export const GameSelectionTab: React.FC<GameSelectionTabProps> = ({
    setStart,
    startNewGame,
    closeGameSelection,
  }) => {
    const gameTime = useBoardStore((state) => state.boardState.gameTime);
    const setBoardState = useBoardStore((state) => state.setBoardState);
    return (
      <div className="bg-zinc-800 px-5 py-5 flex flex-col gap-y-5 w-full h-full max-w-[400px]">
        <div className=" flex  justify-end w-full h-[40px]">
          <ArrowLeftCircleIcon
            className="w-[30px] h-[30px]"
            onClick={() => closeGameSelection()}
          />
        </div>
        <SelectTime
          time={gameTime}
          setTime={(time: number) => {
            setBoardState("gameTime", time as GameTime);
          }}
        />
        <Button
          className=" sm:w-[300px]  w-full h-[60px] hover:bg-green-700 bg-green-800 flex gap-y-4 shadow-sm shadow-white  rounded-xl"
          onClick={() => {
            setStart();
            startNewGame();
            closeGameSelection();
          }}
        >
          <p className="sm:text-2xl text-2xl sm:font-extrabold font-bold">Play</p>
        </Button>
      </div>
    );
  };
  