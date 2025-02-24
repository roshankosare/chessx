import { useShallow } from "zustand/shallow";
import { useBoard } from "./useBoard";
import { useSocket } from "./useSocket";
import { useCallback } from "react";
import { useTiles } from "./useTiles";
import { useRenderCount } from "./useRenderCount";

export const useSelectTile = () => {
  const [getBoardStateValue, setBoardState, setBoardStateValue] = useBoard(
    useShallow((state) => [
      state.getBoardStateValue,
      state.setBoardState,
      state.setBoardStateValue,
    ])
  );
  const [selectPiece, setPossibleMoves] = useTiles(
    useShallow((state) => [state.selectPiece, state.setPossibleMoves])
  );

  useRenderCount();
  const { getSocketValue } = useSocket();

  const selectSquare = useCallback(
    async (id: string, selected: boolean) => {
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
          const promotionalMoves = getBoardStateValue("promotionalMoves");

          if (move.from && move.to && socket) {
            if (promotionalMoves.length > 0) {
              if (
                promotionalMoves.some((m) => m.includes(move.to || "jnsdjnsk"))
              ) {
                setBoardState("showPomotionWindow", true);
                while (getBoardStateValue("showPomotionWindow")) {
                  await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms before checking again
                }
              }
            }
            const roomId = getBoardStateValue("roomId");
            const playingId = getBoardStateValue("playingId");
            const promotionPiece = getBoardStateValue("promotionPiece");
            socket.emit("make-move", {
              from: move.from,
              to: move.to,
              roomId: roomId,
              promotionPiece: promotionPiece,
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

  return { selectSquare };
};
