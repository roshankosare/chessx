import { useCallback, useEffect } from "react";
import Tile from "./tile";
import { useBoard } from "./useBoard";
import { useTiles } from "./useTiles";

const PlotTiles = () => {
  console.log("tiles rendered");
  const { tiles, setTiles, reverseTiles, setPossibleMoves, selectPiece } =
    useTiles();
  const getBoardStateValue = useBoard((state) => state.getBoardStateValue);
  const setBoardState = useBoard((state) => state.setBoardState);
  const setBoardStateValue = useBoard((state) => state.setBoardStateValue);
  const boardPos = useBoard((state) => state.boardState.boardPos);
  const playingAs = useBoard((state) => state.boardState.playingAS);

  const selectSquare = useCallback(
    (id: string, selected: boolean) => {
      const selectedPiece = getBoardStateValue("selectedPiece");
      if (selectedPiece == id) {
        selected = false;
        setBoardState("selectedPiece", null);
        setPossibleMoves([]);
        return;
      }

      if (selectedPiece && selectedPiece != id) {
        if (selected) {
          setBoardStateValue({
            move: {
              from: selectedPiece,
              to: id,
            },
            selectedPiece: null,
          });
          setPossibleMoves([]);
          return;
        }
      }
      selectPiece(id, playingAs, (square: string | null) => {
        if (selectedPiece == square) {
          setBoardState("selectedPiece", null);
          return;
        }
        setBoardState("selectedPiece", square);
      });
    },
    [
      getBoardStateValue,
      playingAs,
      setBoardState,
      selectPiece,
      setPossibleMoves,
      setBoardStateValue,
    ]
  );

  useEffect(() => {
    if (boardPos) setTiles(boardPos);
  }, [boardPos, setTiles]);

  useEffect(() => {
    if (playingAs == "b") {
      reverseTiles();
    }
  }, [playingAs, reverseTiles]);
  return (
    <>
      {tiles.map((t) => (
        <Tile
          key={t.id}
          color={t.color}
          piece={t.piece ? true : false}
          pcolor={t.piece && t.piece.color}
          ptype={t.piece && t.piece.type}
          selected={t.selected}
          id={t.id}
          selectSquare={selectSquare}
        />
      ))}
    </>
  );
};

export default PlotTiles;
