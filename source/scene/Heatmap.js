import * as h337 from '../../thirdParty/heatmap'
import destroyObject from '../core/destroyObject'
const { Math: CesiumMath, Cartesian3, Rectangle, Primitive,
	GeometryInstance, RectangleGeometry, EllipsoidSurfaceAppearance,
	Material, Event, defaultValue, RenderState, StencilFunction,
	StencilOperation, BlendingState, Cartographic, GroundPrimitive } = Cesium;
/**
 * https://blog.csdn.net/Tmraz/article/details/113501692
 * @param {*} altitude 
 * @returns 
 */
function altitudeToZoom(altitude) {
	altitude = altitude < 10 ? 10 : altitude;
	var A = 40487.57;
	var B = 0.00007096758;
	var C = 91610.74;
	var D = -40467.74;

	const zoom = D + (A - D) / (1 + Math.pow(altitude / C, B));
	return Math.floor(zoom)
}

function getRectangleFromPoints(options) {
	const bound = options.bound;
	if (Array.isArray(bound)) {
		return bound.map(_ => CesiumMath.toRadians(_));
	}
	const points = options.points;
	if (!points) {
		return null;
	}
	const rectangle = Rectangle.fromCartesianArray(points);
	return Rectangle.pack(rectangle, []);
}
function getHeatMapPoint(point, rect, { width, height }) {
	const x = (point.x - rect[0]) / (rect[2] - rect[0]) * width;
	const y = (rect[3] - point.y) / (rect[3] - rect[1]) * height;
	// console.log(pixel.x, pixel.y, x, y)
	// 必须是整数
	return { x: Math.floor(x), y: Math.floor(y), value: point.value };
}
/**
 * @see https://blog.csdn.net/chenguizhenaza/article/details/116783045
 */
function getViewRectangle(viewer) {
	// computeViewRectangle,计算椭球上的近似可见矩形（返回 Rectangle），如果椭圆形根本不可见，则返回undefined。
	let rectangle = viewer.camera.computeViewRectangle();
	if (typeof rectangle === "undefined") {
		//2D下会可能拾取不到坐标，extend返回undefined,所以做以下转换
		let canvas = viewer.scene.canvas;
		let upperLeft = new Cesium.Cartesian2(0, 0); //canvas左上角坐标转2d坐标
		let lowerRight = new Cesium.Cartesian2(canvas.clientWidth, canvas.clientHeight); //canvas右下角坐标转2d坐标

		let ellipsoid = viewer.scene.globe.ellipsoid;
		let upperLeft3 = viewer.camera.pickEllipsoid(upperLeft, ellipsoid); //2D转3D世界坐标

		let lowerRight3 = viewer.camera.pickEllipsoid(lowerRight, ellipsoid); //2D转3D世界坐标

		let upperLeftCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(upperLeft3); //3D世界坐标转弧度
		let lowerRightCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(lowerRight3); //3D世界坐标转弧度

		let minx = Cesium.Math.toDegrees(upperLeftCartographic.longitude); //弧度转经纬度
		let maxx = Cesium.Math.toDegrees(lowerRightCartographic.longitude); //弧度转经纬度

		let miny = Cesium.Math.toDegrees(lowerRightCartographic.latitude); //弧度转经纬度
		let maxy = Cesium.Math.toDegrees(upperLeftCartographic.latitude); //弧度转经纬度
		rectangle = Rectangle.fromDegrees(minx, miny, maxx, maxy);
	}
	return rectangle; //返回屏幕所在经纬度范围
}
class Heatmap {
	/**
	 * 热力图
	 * @param {object} options 具有以下属性
	 * @param {array} options.points 用于生成热力图的点位信息，每个点应该包括坐标信息x,y和统计值value
	 * @param {max} [options.max] 热力图统计值的最大值
	 * @param {min} [options.min] 热力图统计图的最小值
	 * @param {string} [options.lonField = 'lon'] point中表示经度的属性
	 * @param {string} [options.latField = 'lat'] point中表示纬度的属性
	 * @param {string} [options.valueField = 'value'] point中表示value的属性
	 * @param {boolean} [options.autoRerender = true] 当相机高度变化超过一定范围时，是否自动重绘热力图，如果未指定heatmapOptions.radius，该属性将不能生效
	 * @param {boolean} [options.useLocalExtrema = true] 当视图发生变化时，是否使用当前视图范围内的点重新渲染热力图
	 * @param {boolean} [options.render3D = false] 是否渲染为3D热力图
	 * @param {number} [options.granularity = 10] 热力图的细分粒度，值越大，顶点越多，插值效果越好，性能越低，仅需要渲染3D热力图时设置该值, clampToGround必须为false才能生效
	 * @param {number} [options.clampToGround = false] 是否贴地
	 * @param {object} [options.heatmapOptions] 热力图参数, 点击{@link https://www.patrick-wied.at/static/heatmapjs/docs.html|heatmap.js documentation}查看详情
	 */
	constructor(options = {}) {
		this._options = options;
		if (!this._options.points) {
			throw new Error("parameter points must be provided");
		}
		const lonField = options.lonField || 'lon';
		const latField = options.latField || 'lat';
		const valueField = options.valueField || 'value';
		if (!Array.isArray(this._options.points)) {
			throw new Error("points must be specified");
		}
		const points = this._options.points.map(_ => ({ x: _[lonField], y: _[latField], value: _[valueField] }));
		this.points = points.map(_ => {
			return {
				cartesian: Cartesian3.fromDegrees(_.x, _.y),
				value: _.value,
				heatmapPoint: undefined,
				x: _.x,
				y: _.y
			}
		})
		this.rectangle = getRectangleFromPoints({
			bound: this._options.bound,
			points: this.points.map(_ => _.cartesian)
		});
		if (!this.rectangle) {
			throw new Error("rectangle computed failed");
		}
		this._autoRerender = defaultValue(this._options.autoRerender, true);

		this._useLocalExtrema = defaultValue(options.useLocalExtrema, true);

		const heatmapOptions = this._options.heatmapOptions;
		const defaultOptions = {
			maxOpacity: 0.8,
			minOpacity: 0.0,
			blur: 0.85,
			gradient: {
				'0.3': 'rgb(0, 0, 255)',
				'0.5': 'rgb(0, 255, 0)',
				'0.7': 'rgb(255, 255, 0)',
				'0.95': 'rgb(255, 0, 0)'
			}
		}
		this._clampToGround = defaultValue(options.clampToGround, false);
		const { container, width, height } = this._createContainer(this.rectangle);
		this._container = container;
		this.width = width;
		this.height = height;
		this._heatmapOptions = Object.assign({}, defaultOptions, heatmapOptions || {});
		this.heatmap = h337.create({
			...this._heatmapOptions,
			container
		})
		this._radius = this.autoRadius = 2;
		if (this._heatmapOptions.radius) {
			this._radius = this.autoRadius = this._heatmapOptions.radius;
		}
		this.radiusChange = new Event();
		this._render3D = options.render3D;
		if (this._render3D) {
			this.heightMapCanvas = document.createElement('canvas');
			this.heightMapCanvas.width = this.width;
			this.heightMapCanvas.height = this.height;
		}
		this._granularity = options.granularity;
	}
	/**
	* 当相机高度变化时，是否自动重绘热力图
	*/
	get autoRerender() {
		return this._autoRerender;
	}
	set autoRerender(value) {		
		const radius = this._radius;
		if (value) {
			const maxZoom = 23;
			const cameraHeight = this._viewer.camera.positionCartographic.height;
			const zoom = altitudeToZoom(cameraHeight);
			this.autoRadius = radius * maxZoom / zoom;
		}
		this._autoRerender = value;
		this.update();
	}
	/**
	 * 是否仅使用屏幕范围内的点计算热力图
	 */
	get useLocalExtrema() {
		return this._useLocalExtrema;
	}
	set useLocalExtrema(value) {
		this._useLocalExtrema = value;
		this.update();
	}
	/**
	 * 表示热力图的细分粒度，值越大，顶点越多，插值效果越好，性能越差，仅当热力图渲染为3D时有效
	 */
	get granularity() {
		if (!this._granularity) {
			return 1;
		}
		return this._granularity;
	}
	set granularity(value) {
		if (this.render3D) {
			this._granularity = Math.min(value, 30);
			this._updateTexture();

		}
	}
	get radius() { return this._radius; }
	set radius(value) {
		if (typeof value !== 'number') {
			return;
		}
		if (!this.heatmap) {
			return;
		}
		if (value < 0) {
			value = -value;
		}
		if (value < 0.5) { // 根据测试，半径小于0.5时，有概率会出错
			value = 0.5;
		}
		this._radius = value;
		this.update();
	}
	get render3D() { return this._render3D; }
	set render3D(value) {
		this._render3D = value;
		this._updateTexture();
	}
	/**
	 * 将Cesium中的经纬度点转换成屏幕坐标并赋给heatmap
	 * @private
	 */
	_setData() {
		const data = [];
		const values = [];
		let points = this.points;
		let rectangle = this.rectangle;
		let width = this.width
		let height = this.height;
		const radius = this.autoRerender ? this.autoRadius : this.radius;
		// 当前视图范围内的点
		if (this.useLocalExtrema) {
			points = this._getPointsInCurrentView();
			this._container.style.width = width + 'px';
			this._container.style.height = height + 'px'
			rectangle = Rectangle.pack(Cesium.Rectangle.fromCartographicArray(points.map(_ => _.cartesian)), [])
			rectangle = rectangle.map(_ => CesiumMath.toRadians(_));
		}
		const rectInDegrees = this.rectangle.map(_ => CesiumMath.toDegrees(_))
		for (let point of points) {
			let dataPoint = point.heatmapPoint;
			if (!dataPoint) {
				dataPoint = getHeatMapPoint(point, rectInDegrees, { width, height });
				dataPoint && (dataPoint.value = point.value);
			}
			if (!dataPoint || typeof dataPoint.value !== 'number') {
				continue;
			}
			dataPoint.radius = radius;
			values.push(dataPoint.value);
			data.push(dataPoint);
		}
		const { min, max } = this._options;
		const minValue = typeof min === 'number' ? min : Math.min(...values);
		const maxValue = typeof max === 'number' ? max : Math.max(...values);
		this._heatmapData = {
			min: minValue,
			max: maxValue,
			data: data
		}
		if (data.length) {
			this.heatmap.setData(this._heatmapData);
		}
		this._updateTexture()
	}
	/**
	 * 将更新后的热力图作为纹理贴到cesium图元上
	 * @private
	 */
	_updateTexture() {
		if (!(this.primitive && this.heatmap)) {
			return;
		}
		// if (this._render3D) {
		// 	const hslTexture = this.heightMapCanvas
		// 	const canvas = this.heatmap._renderer.canvas
		// 	const ctx = hslTexture.getContext('2d');
		// 	const rgbColor = canvas.getContext('2d').getImageData(0, 0, this.width, this.height);
		// 	const pixelData =rgbColor.data;
		// 	for (let index = 0, length = pixelData.length; index < length; index+=4) {
		// 		const hsl = colorConvert.rgb.hsl(pixelData[index], pixelData[index + 1], pixelData[index + 2])
		// 		pixelData[index] = hsl[0];
		// 		pixelData[index + 1] = hsl[1];
		// 		pixelData[index + 2] = hsl[2];
		// 	}
		// 	ctx.putImageData(rgbColor, 0, 0);
		// } else {

		// }
		// this.primitive.appearance.material.uniforms.heightMap = this.heightMapCanvas.toDataURL();
		this.primitive.appearance.material.uniforms.image = this.heatmap.getDataURL();
		this.primitive.appearance.material.uniforms.is3D = this.render3D ? 1.0 : 0.0;
	}
	/**
	 * 更新热力图
	 */
	update() {
		this._setData();
	}
	/**
	 * @private
	 */
	createLayer() {
		const texture = this.heatmap.getDataURL('image/png');
		const renderState = RenderState.fromCache({
			cull: {
				enabled: true
			},
			depthTest: {
				enabled: false
			},
			stencilTest: {
				enabled: true,
				frontFunction: StencilFunction.ALWAYS,
				frontOperation: {
					fail: StencilOperation.KEEP,
					zFail: StencilOperation.KEEP,
					zPass: StencilOperation.REPLACE
				},
				backFunction: StencilFunction.ALWAYS,
				backOperation: {
					fail: StencilOperation.KEEP,
					zFail: StencilOperation.KEEP,
					zPass: StencilOperation.REPLACE
				},
				reference: 2,
				mask: 2
			},
			blending: BlendingState.ALPHA_BLEND
		})
		const constructor = this._clampToGround ? GroundPrimitive : Primitive;
		const primitive = new constructor({
			geometryInstances: new GeometryInstance({
				geometry: new RectangleGeometry({
					rectangle: Rectangle.unpack(this.rectangle),
					granularity: CesiumMath.RADIANS_PER_DEGREE / 20
					// vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
				})
			}),
			appearance: new EllipsoidSurfaceAppearance({
				renderState,
				aboveGround: false,
				material: new Material({
					fabric: {
						type: 'Image',
						uniforms: {
							image: texture,
							is3D: this.render3D ? 1.0 : 0.0
						},
					}
				}),
				vertexShaderSource: `attribute vec3 position3DHigh;
				attribute vec3 position3DLow;
				attribute vec2 st;
				attribute float batchId;
				uniform sampler2D image_0;
				varying vec3 v_positionMC;
				varying vec3 v_positionEC;
				uniform float is3D_1;
				varying vec2 v_st;
				void main() {
					vec4 p = czm_computePosition();
					v_positionMC = position3DHigh + position3DLow;           // position in model coordinates
					v_positionEC = (czm_modelViewRelativeToEye * p).xyz;     // position in eye coordinates
					v_st = st;
					if (is3D_1 == 1.0) {
						vec4 color = texture2D(image_0, st);
					  vec3 normal = normalize(v_positionMC.xyz);
					  vec3 delta = normal * color.a * 100000.0;
					  p += vec4(delta, 0.0);
					}
					gl_Position = czm_modelViewProjectionRelativeToEye * p;
				}`
			})
		});
		this.primitive = primitive;
		this._updateTexture();
	}
	_addEventListener() {
		if (!this._radius) {
			return;
		}
		if (this._removeEventListener) {
			this._removeEventListener();
		}

		const maxZoom = 23;
		// 相机移动后重新计算半径
		this._removeEventListener = this._viewer.camera.moveEnd.addEventListener(() => {
			const radius = this._radius;
			if (this.autoRerender) {
				const cameraHeight = this._viewer.camera.positionCartographic.height;
				const zoom = altitudeToZoom(cameraHeight);
				this.autoRadius = radius * maxZoom / zoom;
			}
			if (this.autoRerender || this.useLocalExtrema) {
				this.update();
			}

		})
	}
	_getPointsInCurrentView() {
		if (!this._viewer) {
			return;
		}
		const rectangle = getViewRectangle(this._viewer);
		return this.points.filter(_ => Rectangle.contains(rectangle, Cartographic.fromCartesian(_.cartesian)));
	}
	/**
	 * 将热力图添加到场景
	 * @param {Cesium.Viewer} viewer 
	 */
	addTo(viewer) {
		if (!viewer) {
			throw new Error('viewer must be required.');
		}
		this._viewer = viewer;
		this._setData();
		this.createLayer();
		viewer.scene.primitives.add(this.primitive);
		this._addEventListener();
	}
	/**
	 * 将热力图从场景中移除
	 */
	remove() {
		if (!this._viewer) {
			throw new Error('heatmap is not initialized');
		}
		if (!this.primitive) {
			return;
		}
		this._viewer.scene.primitives.remove(this.primitive);
	}
	/**
	 * 定位到热力图
	 */
	zoomTo() {
		if (!this._viewer) {
			throw new Error('heatmap is not initialized');
		}
		this._viewer.camera.flyTo({
			destination: Rectangle.unpack(this.rectangle),
			duration: 0
		})
	}
	/**
	 * @private
	 */
	_createContainer(rectangle) {
		const el = document.createElement('div');
		const width = 1920;
		let height = 0;
		if (rectangle) {
			const radio = (rectangle[2] - rectangle[0]) / (rectangle[3] - rectangle[1]);
			if (!isNaN(radio)) {
				height = Math.floor(width / radio);
			}
		}
		el.className = 'cesium-heatmap-container'
		el.setAttribute('style', `width: ${width}px;height: ${height}px;display: none`);
		document.body.appendChild(el);
		return { container: el, width, height };
	}
	/**
	 * 销毁热力图
	 */
	destroy() {
		this.remove();
		this._removeEventListener && this._removeEventListener();
		document.body.removeChild(this._container);
		destroyObject(this);
	}
}
export default Heatmap;