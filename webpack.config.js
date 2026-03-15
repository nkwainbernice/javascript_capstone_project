const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// ...existing code...

module.exports = (env, argv) => {
  const isProd = argv && argv.mode === 'production';

  return {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'bundle.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      // ESLintPlugin removed to prevent "Couldn't find FlatESLint" and related errors
    ],
    mode: isProd ? 'production' : 'development',
  };
};