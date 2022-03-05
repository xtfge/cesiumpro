const {
    Color
} = Cesium;
class Selection{
    /**
     * 构造一个选择器，用于获取和所给边界相交的要素
     * toddo
     */
    constructor() {

    }
    /**
     * 被选中的点要素的颜色
     * @memberof Selection
     * @default Cesium.Color.AQUA
     */
    static pointColor = Color.AQUA;
    /**
     * 被选中的面要素的填充色
     * @memberof Selection
     * @default Cesium.Color.AQUA
     */
    static fillColor = Color.AQUA;
    /**
     * 被选中的线要素的颜色
     * @memberof Selection
     * @default Cesium.Color.AQUA
     */
    static strokeColor = Color.AQUA;
}
export default Selection;