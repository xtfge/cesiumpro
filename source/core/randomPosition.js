
export default function randomPosition(rectangle, count = 1) {
  const minX = rectangle.west;
  const maxX = rectangle.east;
  const minY = rectangle.south;
  const maxY = rectangle.north;
  if (count < 1) {
    count = 1;
  }
  const rst = []
  for (let i = 0; i < count; i++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    rst.push(Cesium.Cartesian3.fromRadians(x, y));
  }
  return rst
}