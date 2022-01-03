```js
module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                CESIUM_BASE_URL: JSON.stringify('')
             }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'node_modules/cesium/Build/Cesium/Workers', to: 'Workers' },
                    { from: 'node_modules/cesium/Build/Cesium/ThirdParty', to: 'ThirdParty' },
                    { from: 'node_modules/cesium/Build/Cesium/Assets', to: 'Assets' },
                    { from: 'node_modules/cesium/Build/Cesium/Widgets', to: 'Widgets' }
                ]
            })
        ]
    }
}
```