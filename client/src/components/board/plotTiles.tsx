import { useCallback, useEffect } from "react";
import Tile from "./tile";
import { useBoard } from "./useBoard";
import { useTiles } from "./useTiles";
import { useSocket } from "./useSocket";
import { useRenderCount } from "./useRenderCount";
import { useShallow } from "zustand/shallow";

const PlotTiles = () => {
  const { tiles, reverseTiles, setPossibleMoves, selectPiece, setTiles } =
    useTiles();

  const [playingAs, boardPos, possibleMoves] = useBoard(
    useShallow((state) => [
      state.boardState.playingAS,
      state.boardState.boardPos,
      state.boardState.possibleMoves,
    ])
  );

  const [getBoardStateValue, setBoardState, setBoardStateValue] = useBoard(
    useShallow((state) => [
      state.getBoardStateValue,
      state.setBoardState,
      state.setBoardStateValue,
    ])
  );

  const { getSocketValue } = useSocket();
  useRenderCount();
  const selectSquare = useCallback(
    (id: string, selected: boolean) => {
      const playingAs = getBoardStateValue("playingAS");
      const selectedPiece = getBoardStateValue("selectedPiece");
      const socket = getSocketValue();
      if (selectedPiece == id) {
        // if slected piece is selected again then unselect it
        selected = false;
        setBoardState("selectedPiece", null);
        setPossibleMoves([]);
        return;
      }

      if (selectedPiece && selectedPiece != id) {
        // if peace is already selected and slected square is not square which has piece then
        // execute move from piece square to selected square
        if (selected) {
          setBoardStateValue({
            move: {
              from: selectedPiece,
              to: id,
            },
            selectedPiece: null,
          });

          const move = getBoardStateValue("move");
          if (move.from && move.to && socket) {
            const roomId = getBoardStateValue("roomId");
            const playingId = getBoardStateValue("playingId");
            socket.emit("make-move", {
              from: move.from,
              to: move.to,
              roomId: roomId,
              playerId: playingId,
            });
            setBoardStateValue({
              move: {
                from: null,
                to: null,
              },
            });
          }

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

      // select piece first then get possible moves of that piece
      const roomId = getBoardStateValue("roomId");
      const playingId = getBoardStateValue("playingId");
      const selectedPieceNew = getBoardStateValue("selectedPiece");
      if (socket) {
        socket.emit("get-pos-moves", {
          roomId: roomId,
          playerId: playingId,
          square: selectedPieceNew,
        });
      }
    },
    [
      getSocketValue,
      getBoardStateValue,
      setBoardState,
      selectPiece,
      setPossibleMoves,
      setBoardStateValue,
    ]
  );

  useEffect(() => {
    if (playingAs == "b") {
      reverseTiles();
    }
  }, [playingAs, reverseTiles]);

  useEffect(() => {
    if (possibleMoves.length > 0) {
      setPossibleMoves([...possibleMoves]);
    }
  }, [setPossibleMoves, possibleMoves]);

  useEffect(() => {
    if (boardPos) {
      setTiles(boardPos);
    }
  }, [setTiles, boardPos]);
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
