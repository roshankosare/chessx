import { PlayingAS } from "@/types";
import { Clock } from "lucide-react";
import React from "react";

type PlayerInfoProps = {
  type: "p" | "o";
  playingAS?: PlayingAS;
  username?: string;
  remainingTime?: number;
};

const formatter = new Intl.NumberFormat('en-US', {
  minimumIntegerDigits: 2,
  useGrouping: false
});

const PlayerInfo: React.FC<PlayerInfoProps> = ({
  type,
  playingAS,
  username,
  remainingTime,
}) => {
  return (
    <div className=" w-full h-12 flex justify-between items-center">
      <div className="w-auto px-4 py-2 flex gap-x-2 ">
        <img src="/user-icon.jpg" className="w-10 h-10" />
        <div className="my-auto text-lg">{username}</div>
      </div>
      <div
        className={`font-bold px-4 py-2 w-28 rounded-md flex justify-between  ${
          type === "p"
            ? playingAS === "w"
              ? "bg-white text-black"
              : "bg-black text-white"
            : playingAS === "b"
            ? "bg-white text-black"
            : "bg-black text-white"
        } 
        
       `}
      >
        <Clock className="w-5 h-5 my-auto" />
        <p className="font-bold text-lg"></p>
        {remainingTime && Math.floor(remainingTime / (60 * 1000))} :
        {remainingTime && formatter.format((remainingTime % (60 * 1000)) / 1000)}
      </div>
    </div>
  );
};

export default PlayerInfo;
