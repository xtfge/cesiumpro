// import selectFrag from "./shaders/select";
// import blurFrag from "./shaders/seperableBlur";
// import bloomFrag from "./shaders/bloom";
let selectFrag = '',
  blurFrag = '',
  bloomFrag = ''
class BloomPass {
  constructor() {
    const kernelSizeArray = [3, 5, 7, 9, 11];
    this.nMips = kernelSizeArray.length;
    let scale = 0.5;
    let array = [];
    const selectPass = new Cesium.PostProcessStage({
      fragmentShader: selectFrag,
    })
    array.push(selectPass);

    for (let i = 0; i < this.nMips; i++) {
      const blurX = this.createBlurPass(kernelSizeArray[i], new Cesium.Cartesian2(1.0, 0.0), scale);
      const blurY = this.createBlurPass(kernelSizeArray[i], new Cesium.Cartesian2(0.0, 1.0), scale);
      array.push(blurX, blurY);
      scale /= 2;
    }
    const blurUnion = new Cesium.PostProcessStageComposite({
      stages: array
    })
    const bloomPass = new Cesium.PostProcessStage({
      fragmentShader: bloomFrag,
      uniforms: {
        bloomStrength: 3.0,
        bloomRadius: 1.0,
        blurTexture1: array[2].name,
        blurTexture2: array[4].name,
        blurTexture3: array[6].name,
        blurTexture4: array[8].name,
        blurTexture5: array[10].name,
        bloomFactors: [1.0, 0.8, 0.6, 0.4, 0.2],
        bloomTintColors: [
          new Cesium.Cartesian3(1, 1, 1),
          new Cesium.Cartesian3(1, 1, 1),
          new Cesium.Cartesian3(1, 1, 1),
          new Cesium.Cartesian3(1, 1, 1),
          new Cesium.Cartesian3(1, 1, 1)
        ]
      }
    })
    const uniforms = {};
    Object.defineProperties(uniforms, {
      bloomStrength: {
        get: function() {
          return bloomPass.uniforms.bloomStrength;
        },
        set: function(value) {
          bloomPass.uniforms.bloomStrength = value;
        }
      },
      bloomRadius: {
        get: function() {
          return bloomPass.uniforms.bloomRadius;
        },
        set: function(value) {
          array[2].uniforms.bloomRadius = value;
          array[4].uniforms.bloomRadius = value;
          array[6].uniforms.bloomRadius = value;
          array[8].uniforms.bloomRadius = value;
          array[10].uniforms.bloomRadius = value;
          bloomPass.uniforms.bloomRadius = value;
        }
      }
    });
    const bloomPassComposite = new Cesium.PostProcessStageComposite({
      stages: [blurUnion, bloomPass],
      inputPreviousStageTexture: false,
      uniforms
    });
    return bloomPassComposite;
  }
  creatBlurPass(kernelRadius, direction, size) {
    return new Cesium.PostProcessStage({
      fragmentShader: `#define KERNEL_RADIUS ${kernelRadius} \n
                      #define SIGMA ${kernelRadius} \n
                      {blurFrag}`,
      uniforms: {
        direction,
        scale: size,
        bloomRadius: 0.0
      },
      sampleMode: Cesium.PostProcessStageSampleMode.LINEAR
    })
  }

}


export default class UnrealBloomPass {
  constructor() {
    const kernelSizeArray = [3, 5, 7, 9, 11];
    this.nMips = kernelSizeArray.length;
    let scale = 0.5;
    let array = [];
    const selectPass = new Cesium.PostProcessStage({
      fragmentShader: selectFrag
    });
    array.push(selectPass);


    Object.defineProperties(uniforms, {
      bloomStrength: {
        get: function() {
          return bloomPass.uniforms.bloomStrength;
        },
        set: function(value) {
          bloomPass.uniforms.bloomStrength = value;
        }
      },
      bloomRadius: {
        get: function() {
          return bloomPass.uniforms.bloomRadius;
        },
        set: function(value) {
          array[2].uniforms.bloomRadius = value;
          array[4].uniforms.bloomRadius = value;
          array[6].uniforms.bloomRadius = value;
          array[8].uniforms.bloomRadius = value;
          array[10].uniforms.bloomRadius = value;
          bloomPass.uniforms.bloomRadius = value;
        }
      }
    });
  }
}
