import { getPieceImage } from "@/lib/chess";

type TakenPiecesProps = {
  pieces: string[];
  type: "b" | "w";
};
export const TakenPieces: React.FC<TakenPiecesProps> = ({ pieces, type }) => {
  return (
    <div className="flex">
      {pieces.map((p, index) => (
        <div
          style={{
            width: "18px",
            height: "18px",
            marginLeft:
              index > 0 && pieces[index - 1] === pieces[index]
                ? "-10px"
                : "0px",
            position: "relative", // Ensures proper stacking
            zIndex:
              index > 0 && pieces[index - 1] === pieces[index] ? index : 0,
          }}
          key={index}
        >
          <img src={getPieceImage(type + p)} className="w-full h-full" alt="" />
        </div>
      ))}
    </div>
  );
};
