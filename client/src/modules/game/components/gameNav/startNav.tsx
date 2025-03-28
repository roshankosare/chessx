import { Button } from "@/components/ui/button";
import React from "react";

type StartNavProps = {
  setShowGameSelection: (value: boolean) => void;
  setShowBotGameSelection: (value: boolean) => void;
  setMatchType: (value: "H" | "M") => void;
};

const StartNav: React.FC<StartNavProps> = ({
  setShowBotGameSelection,
  setShowGameSelection,
  setMatchType,
}) => {
  return (
    <>
      <Button
        className=" sm:w-[300px] hover:bg-green-700  w-full h-[70px] sm:h-[80px] bg-green-800 flex shadow-sm shadow-white  gap-y-4  rounded-3xl"
        onClick={() => {
          setMatchType("H");
          setShowGameSelection(true);
        }}
      >
        <div className="w-full h-full flex flex-row gap-x-4 justify-start px-4">
          <img src="/pawn-logo.png" className="h-[45px] my-auto" />
          <div className="flex flex-col gap-y-2 my-auto">
            <p className="sm:text-3xl text-2xl sm:font-extrabold font-bold">
              Play Online
            </p>
          </div>
        </div>
      </Button>
      <Button
        className=" sm:w-[300px] w-full h-[70px] sm:h-[80px] bg-zinc-800 flex  gap-y-4 shadow-sm shadow-white  rounded-3xl"
        onClick={() => {
          setMatchType("M");
          setShowBotGameSelection(true);
        }}
        disabled
      >
        <div className="w-full px-4 h-full flex flex-row gap-x-4 justify-start">
          <img src="/bot-logo.png" className="h-[45px] my-auto" />
          <div className="flex flex-col gap-y-2 my-auto">
            <p className="sm:text-3xl text-2xl sm:font-extrabold font-bold">
              Play Bot
            </p>
          </div>
        </div>
      </Button>

      {/* <Button className="text-lg font-bold">Play Random</Button> */}
    </>
  );
};

export default StartNav;
