const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const fs = require('fs');

function resolve(relativeUrl) {
  return path.resolve(__dirname, relativeUrl);
}
module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.stories\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: { parser: 'typescript' },
      },
    ],
    enforce: 'pre',
  }, {
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
      },
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          happyPackMode: false,
          appendTsxSuffixTo: [
            '\\.vue$'
          ],
        }
      },
    ],
  }, {
    test: /\.(scss|sass)$/,
    include: [
      resolve('../src')
    ],
    use: [
      'vue-style-loader',
      {
        loader: 'css-loader',
      },
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'sass-loader',
      },
    ],
  });
  config.plugins.push(
    new ForkTsCheckerWebpackPlugin(
      {
        vue: true,
        tslint: false,
        formatter: 'codeframe',
        checkSyntacticErrors: false
      }
    )
  );
  config.resolve.extensions.push('.ts', '.tsx', '.md');
  config.resolve.alias['@'] = resolve('../src');
  return config;
};