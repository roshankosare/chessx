import { useSelectTile } from "../hooks/useSelectTile";
import Tile from "./tile";

const PlotTiles = () => {
  const { selectSquare } = useSelectTile();
  const tiles = Array.from({ length: 64 }, (_, i) => i);

  return (
    <>
      {tiles.map((__, index) => (
        <Tile index={index} key={index} selectSquare={selectSquare} />
      ))}
    </>
  );
};

export default PlotTiles;
