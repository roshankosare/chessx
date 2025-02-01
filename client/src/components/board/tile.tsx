import React, { memo, useState } from "react";

export interface TileProps {
  color: string;
  piece: boolean;
  pcolor: string | null;
  ptype: string | null;

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
const Tile: React.FC<TileProps> = memo(
  ({ color, pcolor, ptype, piece, id, selected, selectSquare }) => {
    // console.log(`tile rerender with id ${id}`);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onClick={() => selectSquare(id, selected)}
        onMouseEnter={() => {
          if (piece) {
            setIsHovered(true);
          }
        }}
        className={`flex justify-center items-center w-full h-full  transition-all
            hover:bg-teal-400 focus:bg-teal-400 `}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: color,
          boxShadow:
            isHovered || selected
              ? "inset 0 0 16px 16px rgba(0, 0, 0, 0.6)"
              : "none",
        }}
      >
        {pcolor && ptype && (
          <img
            className="w-auto  h-4/5 mx-auto my-auto"
            src={getPieceImage(pcolor + ptype)}
            width={200}
            height={200}
            alt=""
          />
        )}
      </div>
    );
  }
);

export default Tile;
