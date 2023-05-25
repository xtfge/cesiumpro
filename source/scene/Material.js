import flowImage from '../shader/flowImage'
const {
    Material,
    Cartesian2,
    Color
} = Cesium;

(function () {
    Material.FlowImageType = 'FlowImage'
    Material._materialCache.addMaterial(Material.FlowImageType, {
        fabric: {
            type: Material.FlowImageType,
            uniforms: {
                color: new Color(1.0, 1.0, 1.0, 1.0),
                repeat: new Cartesian2(1, 1),
                image: '',
                speed: 1.0,
            },
            source: flowImage
        }
    })
})();
export default Material;