const jo = require('javascript-obfuscator');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const cp = require('cpr');
const releaseRoot = 'release'
if (fs.existsSync(releaseRoot)) {
    rimraf.sync(releaseRoot)
}
fs.mkdirSync(releaseRoot);
const cesiumpro = fs.readFileSync('build/CesiumPro.min.js').toString();
const obfuscationResult = jo.obfuscate(cesiumpro,
    {
        compact: false,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
    }
);
fs.writeFileSync(path.join(releaseRoot, 'CesiumPro.min.js'), obfuscationResult.getObfuscatedCode());
cp('build', releaseRoot, {
    filter: function(file) {
        if (/.*CesiumPro.*\.js$/.test(file)) {
            return false;
        }
        return true;
    }
}, function(err, files) {
    console.log(files)
})
