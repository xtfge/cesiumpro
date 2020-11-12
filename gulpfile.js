/**
 * Gulp配置文件
 */
// 引入 gulp
const gulp = require('gulp');

// 引入组件
const sass = require('gulp-sass');
const minifyCss = require('gulp-clean-css');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');
const childProcess = require('child_process');
const streamToPromise = require('stream-to-promise');
const rollup = require('rollup');
const rollupPluginStripPragma = require('rollup-plugin-strip-pragma');
const babel = require('rollup-plugin-babel');
const rollupPluginUglify = require('rollup-plugin-uglify');
const uglify = require('rollup-plugin-uglify-es');
const config = require('./package.json')
// const rename = require('gulp-rename');

const fs = require('fs');
const globby = require('globby');

// const basename = 'cesium-plugins';
const dist = './build';
const version = config.version;

function rollupWarning(message) {
  // Ignore eval warnings in third-party code we don't have control over
  if (message.code === 'EVAL' && /(protobuf-minimal|crunch)\.js$/.test(message.loc.file)) {
    return;
  }
  console.log(message);
}
const copyrightHeader = fs.readFileSync(path.join('source', 'copyrightHeader.js'), 'utf8')
  .replace('{VERSION}', version);

function combineJS(debug, optimizer, combineOutput) {
  const plugins = [babel()];

  if (!debug) {
    plugins.push(rollupPluginStripPragma({
      pragmas: ['debug'],
    }));
  }
  if (optimizer === 'uglify2-es') {
    plugins.push(uglify());
  }
  if (optimizer === 'uglify2') {
    plugins.push(rollupPluginUglify.uglify());
  }
  let format = 'umd';
  if (/.*es$/.test(optimizer)) {
    format = 'esm';
  }

  const ext = /.*es$/.test(optimizer) ? '.esm.js' : '.umd.js';
  return rollup.rollup({
    input: 'source/CesiumPro.js',
    plugins,
    onwarn: rollupWarning,
  }).then((bundle) => bundle.write({
    format,
    name: 'CesiumPro',
    file: path.join(combineOutput, `CesiumPro${ext}`),
    sourcemap: debug,
    banner: copyrightHeader,
  }));
}

function filePathToModuleId(moduleId) {
  return moduleId.substring(0, moduleId.lastIndexOf('.')).replace(/\\/g, '/');
}

function buildCSS() {
  return gulp.src('./source/**/*.scss')
    .pipe(sass()) // 将scss编译成css
    // .pipe(rename('default.css'))
    .pipe(gulp.dest(`${dist}/cesiumProUnminified`)) // 未压缩的css存放目录
    .pipe(minifyCss()) // 压缩css
    // .pipe(rename('default.css')) // 重命名压缩后的css
    .pipe(gulp.dest(`${dist}/cesiumPro`)); // 压缩后的css存放位置
}
const sourceFiles = [
  'source/**/*.js',
  '!source/*.js',
  '!source/*.scss',
];

function createCesiumProJs() {
  let contents = `export const VERSION = '${version}';\n`;
  globby.sync(sourceFiles).forEach((file) => {
    file = path.relative('source', file);

    let moduleId = file;
    moduleId = filePathToModuleId(moduleId);

    let assignmentName = path.basename(file, path.extname(file));
    if (moduleId.indexOf('shader/') === 0) {
      assignmentName = `_shader${assignmentName}`;
    }
    assignmentName = assignmentName.replace(/(\.|-)/g, '_');
    contents += `export { default as ${assignmentName} } from './${moduleId}.js';${os.EOL}`;
  });


  fs.writeFileSync('source/CesiumPro.js', contents);
}

function combineJavaScript(options) {
  const {
    optimizer
  } = options;
  const {
    outputDirectory
  } = options;
  const {
    removePragmas
  } = options;
  const combineOutput = path.join('build', 'combineOutput', optimizer);

  const promise = combineJS(!removePragmas, optimizer, combineOutput);

  return promise.then(() => {
    const promises = [];
    let stream = gulp.src([`${combineOutput}/**`])
      .pipe(gulp.dest(outputDirectory));

    promises.push(streamToPromise(stream));

    const everythingElse = ['source/**', '!**/*.js', '!**/*.glsl'];
    everythingElse.push('!**/*.scss');
    if (optimizer === 'uglify2') {
      promises.push(buildCSS());
    }
    stream = gulp.src(everythingElse, {
        nodir: true
      })
      .pipe(gulp.dest(outputDirectory));
    promises.push(streamToPromise(stream));
    return Promise.all(promises).then(() => {
      const tmp = path.join('build', 'combineOutput', optimizer);
      rimraf.sync(tmp);
      if (globby.sync('build/combineOutput').length === 0) {
        rimraf.sync('build/combineOutput');
      }
    });
  });
}
// 编译Sass
gulp.task('buildCSS', buildCSS);

gulp.task('build', () => {
  rimraf.sync(dist);
  createCesiumProJs();
  combineJavaScript({
    removePragmas: true,
    optimizer: 'uglify2',
    outputDirectory: path.join('build', 'CesiumPro'),
  });
  combineJavaScript({
    removePragmas: true,
    optimizer: 'uglify2-es',
    outputDirectory: path.join('build', 'CesiumPro'),
  });
  combineJavaScript({
    removePragmas: false,
    optimizer: 'none-es',
    outputDirectory: path.join('build', 'CesiumProUnminified'),
  });
  return combineJavaScript({
    removePragmas: false,
    optimizer: 'none',
    outputDirectory: path.join('build', 'CesiumProUnminified'),
  });
});

function generateDocumentation() {
  const envPathSeperator = os.platform() === 'win32' ? ';' : ':';
  rimraf.sync('./documents');

  return new Promise(((resolve, reject) => {
    childProcess.exec('jsdoc --configure ./Tools/jsdoc/conf.json', {
      env: {
        PATH: `${process.env.PATH + envPathSeperator}node_modules/.bin`,
        CESIUM_VERSION: version,
      },
    }, (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
        return reject(error);
      }
      console.log(stdout);
      const stream = gulp.src('documents/images/**').pipe(gulp.dest('build/documents/images'));
      return streamToPromise(stream).then(resolve);
    });
  }));
}

gulp.task('doc', generateDocumentation);
gulp.task('combine', function() {
  return new Promise((resolve) => {
    createCesiumProJs()
    resolve()
  })
})
