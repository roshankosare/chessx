import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getPieceImage } from "@/lib/chess";
import { MoveHistory } from "@/types";
import React from "react";

type MoveHistoryCardProps = {
  setOpenResignGame: (value: boolean) => void;
  moveHistory: MoveHistory;
};

const MoveHistoryCard: React.FC<MoveHistoryCardProps> = ({
  setOpenResignGame,
  moveHistory,
}) => {
  return (
    <div className="w-full  flex flex-col bg-zinc-800">
      <div className="w-full h-[300px] overflow-y-scroll  scrollbar-hide [&::-webkit-scrollbar]:hidden px-2">
        <p className="w-full h-8 bg-zinc-800 text-center font-bold">Moves</p>
        <Table className="w-full  ">
          <TableBody>
            {moveHistory.map((move, index) => (
              <TableRow
                className={`${index % 2 == 0 ? "bg-zinc-900" : ""} border-none`}
                key={index}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {
                    <div className="flex flex-row gap-x-1">
                      <img
                        src={getPieceImage("w" + move[0][0])}
                        className="w-4 h-4 my-auto"
                      />
                      <p>{move[0].slice(1)}</p>
                    </div>
                  }
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-x-1">
                    {move[1] && (
                      <img
                        src={getPieceImage("b" + move[1][0])}
                        className="w-4 h-4 my-auto"
                      />
                    )}
                    <p>{move[1]?.slice(1)}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center gap-x-4">
        <Button
          size={"sm"}
          className="px-4 py-2 items-center my-2 w-[120px]"
          onClick={() => {
            setOpenResignGame(true);
            // setStart();
            // endGame();
          }}
        >
          <p className="text-sm">Resign Game</p>
        </Button>
        <Button
          size={"sm"}
          className="px-4 py-2 items-center my-2 w-[120px]"
          onClick={() => {
            // setOpenResignGame(true);
            // setStart();
            // endGame();
          }}
        >
          <p className="text-sm">Draw</p>
        </Button>
      </div>
    </div>
  );
};

export default MoveHistoryCard;
