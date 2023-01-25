const path                   = require('path'),
      HtmlWebpackPlugin      = require('html-webpack-plugin'),
      MiniCssExtractPlugin   = require('mini-css-extract-plugin'),
      CssMinimizerPlugin     = require("css-minimizer-webpack-plugin"),
      TerserPlugin           = require("terser-webpack-plugin");

const mode    = process.env.NODE_ENV || 'development',
      devMode = mode === 'development';
      target  = devMode ? 'web' : 'browserslist',
      devtool = devMode ? 'source-map' : undefined;

const fileName = ext => devMode ? `[name].${ext}` : `[name].[fullhash].${ext}`;

module.exports = {
  mode,
  target,
  devtool,
  entry: ['@babel/polyfill', path.resolve(__dirname, 'src', './js/index.js')],
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'assets/[name][ext]'
  },
  devServer: {
    watchFiles: ['./src/*'],
    port: 3000,
    open: true,
    hot: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      scriptLoading: 'blocking'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ],
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]'
        }
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};