const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'hiero-ecom-header': './src/main/ts/components/header/header.ts',
    'hiero-ecom-footer': './src/main/ts/components/footer/footer.ts',
    'hiero-ecom-patterns': './src/main/ts/patterns/patterns.ts',
    'hiero-ecom-services': './src/main/ts/shared/services/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist/clientlibs'),
    filename: 'js/[name].js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  devtool: 'source-map'
};