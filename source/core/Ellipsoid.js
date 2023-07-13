const { Ellipsoid } = Cesium;
Ellipsoid.CGCS2000 = Object.freeze(
  new Ellipsoid(6378137.0, 6378137.0, 6356752.31414035585)
);
export default Ellipsoid;