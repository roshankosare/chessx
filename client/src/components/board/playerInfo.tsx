import { Clock } from "lucide-react";
import React from "react";
import { useBoard } from "./useBoard";

type PlayerInfoProps = {
  type: "p" | "o";
};

const formatter = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});

const PlayerInfo: React.FC<PlayerInfoProps> = ({ type }) => {
  const user = useBoard((state) => state.boardState.playersInfo.user);
  const opponent = useBoard((state) => state.boardState.playersInfo.opponent);
  const playingAs = useBoard((state) => state.boardState.playingAS);
  const username = type === "p" ? user.username : opponent.username;
  return (
    <div className=" w-full h-12 flex justify-between items-center px-2">
      <div className="w-auto px-4 py-2 flex gap-x-2 text-center ">
        <img
          src="/user-icon.jpg"
          className="s w-8 h-8 sm:w-10 sm:h-10 my-auto"
        />
        <div className="my-auto  text-sm sm:text-md ">{username}</div>
      </div>
      <div
        className={`font-bold  text-sm sm:text-md px-4 py-2 sm:py-3  w-24 sm:w-28 rounded-md flex justify-between  ${
          type === "p"
            ? playingAs === "w"
              ? "bg-white text-black"
              : "bg-black text-white"
            : playingAs === "b"
            ? "bg-white text-black"
            : "bg-black text-white"
        } 
        
       `}
      >
        <Clock className="w-5 h-5 my-auto" />
        <p className="font-bold text-lg"></p>
        {type === "o"
          ? opponent.remainingTime &&
            Math.floor(opponent.remainingTime / (60 * 1000))
          : user.remainingTime &&
            Math.floor(user.remainingTime / (60 * 1000))}{" "}
        :
        {type === "o"
          ? opponent.remainingTime &&
            formatter.format((opponent.remainingTime % (60 * 1000)) / 1000)
          : user.remainingTime &&
            formatter.format((user.remainingTime % (60 * 1000)) / 1000)}
      </div>
    </div>
  );
};

export default PlayerInfo;
