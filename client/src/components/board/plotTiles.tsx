import Tile from "./tile";
import { useSelectTile } from "./useSelectTile";

const PlotTiles = () => {
  const {selectSquare} = useSelectTile();
  const tiles = Array.from({ length: 64 }, (_, i) => i);

  return (
    <>
      {tiles.map((__, index) => (
        <Tile
          index={index}
          key={index}
          // color={t.color}
          // piece={t.piece ? true : false}
          // pcolor={t.piece && t.piece.color}
          // ptype={t.piece && t.piece.type}
          // selected={t.selected}
          // id={t.id}
          selectSquare={selectSquare}
        />
      ))}
    </>
  );
};

export default PlotTiles;
