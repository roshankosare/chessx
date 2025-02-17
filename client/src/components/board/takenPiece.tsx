import { getPieceImage } from "@/lib/chess";

type TakenPiecesProps = {
  pieces: string[];
  type : "b" | "w"
};
export const TakenPieces: React.FC<TakenPiecesProps> = ({ pieces,type  }) => {
  return (
    <>
      {pieces.map((p, index) => (
        <div className="w-5 h-5" key={index}>
          <img src={getPieceImage(type + p)} className="w-full h-full" alt="" />
        </div>
      ))}
    </>
  );
};
