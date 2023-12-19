const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup'
    },
    override: {
      template: './src/override/override.html',
      entry: './src/override/main.js',
      title: 'Override'
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/github-markdown-css/github-markdown.css'), // Substitua pelo caminho correto para o seu arquivo CSS
            to: path.resolve(__dirname, 'dist/tab.css'), // Substitua pelo caminho correto na pasta dist
          },
        ],
      }),
    ],
  },
};
