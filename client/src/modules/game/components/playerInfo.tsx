import { Clock } from "lucide-react";
import React from "react";
import { useBoardStore } from "../stores/useBoardStore";
import { TakenPieces } from "./takenPiece";

type PlayerInfoProps = {
  type: "p" | "o";
};

const formatter = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});

const PlayerInfo: React.FC<PlayerInfoProps> = ({ type }) => {
  const user = useBoardStore((state) => state.boardState.playersInfo.user);
  const opponent = useBoardStore((state) => state.boardState.playersInfo.opponent);
  const playingAs = useBoardStore((state) => state.boardState.playingAS);

  const blackCapturedPieces = useBoardStore(
    (state) => state.boardState.blackCapturedPieces
  );
  const whiteCapturedPieces = useBoardStore(
    (state) => state.boardState.whiteCapturedPieces
  );
  const username = type === "p" ? user.username : opponent.username;
  return (
    <div className=" w-full h-14 flex justify-between items-center px-2">
      <div className="w-auto px-2  flex gap-x-2 text-center ">
        <img
          src="/user-icon.jpg"
          className="s w-8 h-8 sm:w-10 sm:h-10 my-auto"
        />
        <div className="flex flex-col">
          <div className="my-auto  text-sm sm:text-md relative mt-0">
            {username}
          </div>

          {playingAs === "w" && type === "p" && (
            <TakenPieces pieces={blackCapturedPieces} type="b" />
          )}

          {playingAs === "w" && type === "o" && (
            <TakenPieces pieces={whiteCapturedPieces} type="w" />
          )}
          {playingAs === "b" && type === "o" && (
            <TakenPieces pieces={blackCapturedPieces} type="b" />
          )}

          {playingAs === "b" && type === "p" && (
            <TakenPieces pieces={whiteCapturedPieces} type="w" />
          )}
        </div>
      </div>
      {user.remainingTime !== null && opponent.remainingTime !== null && (
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
      )}
    </div>
  );
};

export default PlayerInfo;
