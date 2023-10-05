const {UniformState, SceneMode, } = Cesium;
function override() {
  UniformState.prototype.updateGlobeClipRegion = function (globeClipRegion) {
    if (!globeClipRegion) {
      this.clipRegionCount = 0;
      return;
    }
    this.clipRegionCount = globeClipRegion.count;
    this.clipBoundingRect = globeClipRegion.boundingRect;
    this.clipInverseLocalModel = globeClipRegion.inverseLocalModel;
    this.clipDepthTexture = globeClipRegion.depthTexture;
    this.clipNormal = globeClipRegion.normal;
    this.clipEnabled = globeClipRegion.enabled;
  };
  const UniformStateUpdate = UniformState.prototype.update;
  UniformState.prototype.update = function (frameState) {
    this.updateGlobeClipRegion(frameState.globeClipRegion);
    UniformStateUpdate.call(this, frameState);
  }
}
export default override;