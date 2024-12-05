const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack').default
const Components = require('unplugin-vue-components/webpack').default
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        cacheGroups: {
          elementplus: {
            name: 'chunk-elementplus',
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            priority: 30
          },
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 20
          }
        }
      }
    }
  }
})
