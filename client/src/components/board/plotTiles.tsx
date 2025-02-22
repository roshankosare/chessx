import Tile from "./tile";
import { useSelectTile } from "./hooks/useSelectTile";

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
