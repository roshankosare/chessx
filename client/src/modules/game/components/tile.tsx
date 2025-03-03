import React, { useState } from "react";;
import { useTilesStore } from "../stores/useTilesStore";

export interface TileProps {
  index: number;
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
const Tile: React.FC<TileProps> = ({ index, selectSquare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pieceColor = useTilesStore((state) => state.tiles[index].piece?.color);
  const pieceType = useTilesStore((state) => state.tiles[index].piece?.type);
  const id = useTilesStore((state) => state.tiles[index].id);
  const selected = useTilesStore((state) => state.tiles[index].selected);
  const color = useTilesStore((state) => state.tiles[index].color);
  const isLastMoveSquare = useTilesStore(
    (state) => state.tiles[index].isLastMoveSquare
  );

  // console.log(`tile rerender with id ${id}`);
  return (
    <div
      onClick={() => selectSquare(id, selected)}
      onMouseEnter={() => {
        if (pieceType && pieceColor) {
          setIsHovered(true);
        }
      }}
      className={`flex justify-center items-center w-full h-full  transition-all
            hover:bg-teal-400 focus:bg-teal-400 `}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: color,
        boxShadow: isLastMoveSquare
          ? "inset 0 0 20px 20px rgba(255, 255, 0, 0.6)"
          : isHovered || selected
            ? "inset 0 0 16px 16px rgba(0, 0, 0, 0.4)"
            : "none",
      }}
    >
      {pieceColor && pieceType && (
        <img
          className="w-auto  h-4/5 mx-auto my-auto"
          src={getPieceImage(pieceColor + pieceType)}
          width={200}
          height={200}
          alt=""
        />
      )}
    </div>
  );
};

export default Tile;
