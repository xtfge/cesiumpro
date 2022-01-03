const os = require('os');
const path = require('path');
const rimraf = require('rimraf');
const rollup = require('rollup')
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify')
const uglifyES = require('rollup-plugin-uglify-es')
const sass = require('gulp-sass')
const fs = require('fs');
const rollupPluginStripPragma = require('rollup-plugin-strip-pragma');
const globby = require('globby')
const { series } = require('gulp');
const gulp = require('gulp')
const streamToPromise = require('stream-to-promise')
const childProcess = require('child_process');
const minifyCss = require('gulp-clean-css');
const rollupPluginTerser = require("rollup-plugin-terser");
const package = require('./package.json');

exports.build = build;

const config = {
    src: 'source',
    dist: 'build',
    assets: 'source/assets/**',
    version: package.version,
    combineOutpath: '__combineOutpath',
    doc: 'documents',
    publicPath: './',
    sourceFiles: [
        'source/**/*.js',
        '!source/CesiumPro.js',
        '!source/copyright.js'
    ],
    outputName: 'CesiumPro'
}
const copyrightHeader = fs.readFileSync(path.join(config.src, 'copyright.js'), 'utf-8');
function filePathToModuleId(moduleId) {
    return moduleId.replace(/\\/g, '/');
}
function rollupWarning(message) {
    // Ignore eval warnings in third-party code we don't have control over
    if (message.code === 'EVAL' && /(protobuf-minimal|crunch)\.js$/.test(message.loc.file)) {
        return;
    }
    console.log(message);
}
function createCesiumProJs() {
    let contents = `export const VERSION = '${config.version}';${os.EOL}`;
    const filelist = globby.sync(config.sourceFiles);
    for (let file of filelist) {
        const filepath = path.relative(config.src, file);
        let basename = path.basename(filepath, path.extname(file))
        if (file.startsWith('source/shader')) {
            basename = `_shader${basename.charAt(0).toUpperCase() + basename.slice(1)}`;
        }
        basename = basename.replace(/(\.|-)/ig, '_');
        contents += `export { default as ${basename} } from './${filePathToModuleId(filepath)}';${os.EOL}`
    }
    fs.writeFileSync(path.join(config.src, `${config.outputName}.js`), contents)
}
function buildModule(debug = true) {
    const plugins = [];
    let libaryName = `${config.outputName}.js`
    if (!debug) {
        plugins.push(rollupPluginStripPragma({
            pragmas: ['debug']
        }))
        plugins.push(rollupPluginTerser.terser());
        libaryName = `${config.outputName}.min.js`
    }
    return rollup.rollup({
        input: `${config.src}/${config.outputName}.js`,
        plugins,
        onwarn: rollupWarning,
    }).then(bundle => {
        bundle.write({
            format: 'umd',
            name: config.outputName,
            sourcemap: debug,
            banner: copyrightHeader,
            file: path.join(config.publicPath, config.dist, libaryName)
        })
    })

}
function combineJS() {
    buildModule(); // CesiumPro.js
    buildModule(false); // CesiumPro.min.js
}
function buildCSS() {

}
function copyAssets() {
    return gulp.src([config.assets], {
        nodir: true
    }).pipe(gulp.dest(`${config.dist}/assets/`));
}
function buildDocument() {
    const seperator = os.platform() === 'win32' ? ';' : ':';
    rimraf.sync(config.doc);
    return new Promise((resolve, reject) => {
        childProcess.exec('jsdoc --configure ./config/jsdoc/conf.json', {
            env: {
                PATH: `${process.env.path + seperator}node_modules/.bin`,
                CESIUMPRO_VERSION: config.version
            }
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(stderr);
                return reject(error)
            }
            const stream = gulp.src(`${config.doc}/images/**`)
                .pipe(gulp.dest(path.join(config.publicPath, config.doc, config.doc, 'documents', 'images')));
            return streamToPromise(stream).then(resolve)
        });
    })

}
function buildCSS() {
    return gulp.src(`${config.src}/**/*.scss`)
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest(path.join(config.publicPath, config.dist)))
}
function build() {
    rimraf.sync(path.join(config.publicPath, config.dist))
    createCesiumProJs();
    combineJS()
    buildCSS()
    copyAssets();
    return Promise.resolve('build success.')
}
exports.build = build;
exports.doc = buildDocument;