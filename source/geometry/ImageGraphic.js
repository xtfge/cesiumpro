import CesiumProError from '../core/CesiumProError';
import LonLat from '../core/LonLat';
import PointBaseGraphic from './PointBaseGraphic';
import SuperGif from '../../thirdParty/libgif'
import defaultValue from '../core/defaultValue';
const {
    BillboardCollection,
    VerticalOrigin
} = Cesium;

function loadGif(url, imageArr = [], parser) {
    const img = document.createElement('img');
    img.src = url
    // gif库需要img标签配置下面两个属性
    img.setAttribute('rel:animated_src', url)
    img.setAttribute('rel:auto_play', '0');
    img.style.cssText = 'position:fixed;zIndex: -1;'
    document.body.appendChild(img);
    // 新建gif实例
    const rub = new SuperGif({ gif: img });
    return new Promise((resolve) => {
        rub.load(() => {
            for (let i = 1; i <= rub.get_length(); i++) {
                // 遍历gif实例的每一帧
                rub.move_to(i);
                const canvas = rub.get_canvas();
                if (parser) {
                    parser(canvas);
                }
                imageArr.push(canvas.toDataURL())
            }
            resolve(imageArr)
            // document.body.removeChild(img)
        });
    })

}
class ImageGraphic extends PointBaseGraphic {
    /**
     * 
     * @param {object} options 具有以下属性
     * @param {string} options.image gif图片
     * @param {LonLat|Cesium.Carteisan3} options.position 位置
     * @param {number} [options.speedFactor = 1.0] 速度因子
     * @param {function} [options.imageParser] 对图片做后处理
     */
    constructor(options) {
        super(options);
        this._primitive = new BillboardCollection();
        this._image = options.image;
        this._speedFactor = defaultValue(options.speedFactor, 1.0);
        this._imageIndex = 0;
        this._imageParser = options.imageParser;
        this.createGraphic();
    }
    get clampToGround() {
        return undefined;
    }
    set clampToGround(val) {
        throw new CesiumProError('clampToGround is not valid.');
    }
    get speedFactor() {
        return this._speedFactor;
    }
    set speedFactor(val) {
        this._speedFactor = val;
    }
    createGraphic() {
        this._requestImage = loadGif(this._image, [], this._imageParser);
        this._billboard = this._primitive.add({
            position: LonLat.toCartesian(this._position),
            image: this._image,
            verticalOrigin: VerticalOrigin.BOTTOM
        });
    }
    update() {
        if (this._speedFactor <= 0) {
            return;
        }
        this._requestImage.then(imageList => {
            const index = Math.floor((this._imageIndex++) / (this._speedFactor));
            const image = imageList[index % imageList.length];
            this._billboard.image = image;
        })
    }
    remove() {
        super.remove();
        this._billboard = undefined
    }
}
export default ImageGraphic;