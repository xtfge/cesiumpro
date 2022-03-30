/**
 * 影像分割显示类型
 * @enum {Number}
 */
const ImagerySplitDirection = Object.freeze({
    /**
     * 影像显示在屏幕左侧
     * @type {Number}
     * @constant
     */
    LEFT:-1,
    /**
     * 影像显示在屏幕右侧
     * @type {Number}
     * @constant
     */
    RIGHT:1,
    /**
     * 一直显示该影像
     * @type {Number}
     * @constant
     */
    NONE:0,
    /**
     * 影像显示在屏幕上方
     * @type {Number}
     * @constant
     */
    TOP:-10,
    /**
     * 影像显示在屏幕下方
     * @type {Number}
     * @constant
     */
    BOTTOM:10
})
export default ImagerySplitDirection 