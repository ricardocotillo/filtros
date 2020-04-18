const { resolve } = require('path')
const webpack = require('webpack')

module.exports = {
  configureWebpack: (config) => {
    config.resolve.alias['@'] = resolve('src')
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    )
  },
}
