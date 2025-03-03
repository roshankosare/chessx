import { generateTileId } from "@/lib/utils";
import { useSelectTile } from "../hooks/useSelectTile";
import Tile from "./tile";
import { useEffect, useState } from "react";
import { useBoardStore } from "../stores/useBoardStore";
import { useShallow } from "zustand/shallow";

const PlotTiles = () => {
  const { selectSquare } = useSelectTile();
  const [tiles, setTiles] = useState(
    Array.from({ length: 64 }, (_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      return generateTileId(row, col);
    })
  );

  const [playingAS] = useBoardStore(
    useShallow((state) => [state.boardState.playingAS])
  );

  useEffect(() => {
    if (playingAS === "b") {
      setTiles((tiles) =>
        Array.from({ length: 8 }, (_, i) =>
          tiles.slice(i * 8, i * 8 + 8).reverse()
        )
          .reverse()
          .flat()
      );
    }
  }, [playingAS]);

  return (
    <>
      {tiles.map((square, index) => (
        <Tile square={square} key={index} selectSquare={selectSquare} />
      ))}
    </>
  );
};

export default PlotTiles;
