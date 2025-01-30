import { Piece } from "@/types";
import React, { useState } from "react";


export interface TileProps {
  color: string;
  piece: Piece | null;
  id: string;
  selected: boolean;
  selectSquare: (id: string, square: boolean) => void;
}

const getPieceImage = (value: string): string => {
  const pieceBaseUrl = "/assets/";
  switch (value) {
    case "wp":
      return pieceBaseUrl + "wp.svg";

    case "bp":
      return pieceBaseUrl + "bp.svg";

    case "wb":
      return pieceBaseUrl + "wb.svg";

    case "bb":
      return pieceBaseUrl + "bb.svg";

    case "wn":
      return pieceBaseUrl + "wn.svg";

    case "bn":
      return pieceBaseUrl + "bn.svg";

    case "wr":
      return pieceBaseUrl + "wr.svg";

    case "br":
      return pieceBaseUrl + "br.svg";

    case "wq":
      return pieceBaseUrl + "wq.svg";

    case "bq":
      return pieceBaseUrl + "bq.svg";

    case "wk":
      return pieceBaseUrl + "wk.svg";

    case "bk":
      return pieceBaseUrl + "bk.svg";
  }

  return "";
};
const Tile: React.FC<TileProps> = ({
  color,
  piece,
  id,
  selected,
  selectSquare,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: color,
        boxShadow:
          isHovered || selected
            ? "inset 0 0 16px 16px rgba(0, 0, 0, 0.6)"
            : "none",
      }}
      onClick={() => selectSquare(id, selected)}
      className={`flex justify-center items-center w-full h-full  transition-all 
        hover:bg-teal-400 focus:bg-teal-400 `}
      onMouseEnter={() => {
        if (piece) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {piece && (
        <img
          className="w-auto  h-4/5 mx-auto my-auto"
          src={getPieceImage(piece.color + piece.type)}
          width={200}
          height={200}
          alt=""
        />
      )}
    </div>
  );
};

export default Tile;
