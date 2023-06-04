/**
 * 内容分割显示类型
 * @enum {Number}
 */
const SplitDirection = Object.freeze({
    /**
     * 数据显示在屏幕左侧
     * @type {Number}
     * @constant
     */
    LEFT: -1,
    /**
     * 数据显示在屏幕右侧
     * @type {Number}
     * @constant
     */
    RIGHT: 1,
    /**
     * 一直显示该数据
     * @type {Number}
     * @constant
     */
    NONE: 0,
    /**
     * 数据显示在屏幕上方
     * @type {Number}
     * @constant
     */
    TOP: -10,
    /**
     * 数据显示在屏幕下方
     * @type {Number}
     * @constant
     */
    BOTTOM:10
})
export default SplitDirection 