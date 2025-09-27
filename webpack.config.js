const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const dotEnv = require('dotenv-webpack')
const path = require('path')
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const autoprefixer = require('autoprefixer');
// const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
const BundleTracker  = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
// let env = process.env.NODE_ENV;
// console.log(env);
// console.log(env);
// console.log(env);

let pathsToClean = [
  'dist'
]

// the clean options to use
let cleanOptions = {
  root:     __dirname + '/assets',
  // exclude:  ['shared.js'],
  verbose:  true,
  dry:      false
}



module.exports = (env) => {
  let isProd = env.production;

  let config = {
    entry: {
      // vendor: './assets/js/vendor.js',
      app: './assets/js/app/app.js',
    },

    output: {
      filename: '[name].bundle.js',
      path: path.join(__dirname, 'assets/dist')
    },
    
    module: {
      rules: [{
        test: /\.html$/,
        include: path.resolve(__dirname, 'app/'),
        loader: `ngtemplate-loader?relativeTo=${__dirname}/app/!html-loader`
      }, {
        test: /index.html$/,
        exclude: path.resolve(__dirname, 'node_modules/'),
        use: 'html-loader?name=[name].[ext]'
      }, {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?sourceMap', 'postcss-loader?sourceMap', 'stylus-loader?sourceMap'],
          publicPath: '/dist'
        })
      }, {
        test: require.resolve('angular'),
        use: [{
            loader: 'expose-loader',
            options: 'angular'
        }]
      },
      {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  minimize: true,
                  sourceMap: true,
                  importLoaders: 2,
                  localIdentName: '[local]'
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    autoprefixer({
                      browsers: [
                          'Android 2.3',
                          'Android >= 4',
                          'Chrome >= 20',
                          'Firefox >= 24', // Firefox 24 is the latest ESR
                          'Explorer >= 8',
                          'iOS >= 6',
                          'Opera >= 12',
                          'Safari >= 6'
                      ],
                      cascade: false
                    }),
                  ],
                  sourceMap: true
              }
              },
              {
                loader: 'sass-loader',
                options: {
                  outputStyle: 'expanded',
                  sourceMap: true,
                  sourceMapContents: true
                }
              }
            ]
          })
        },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader?sourceMap'],
          publicPath: '/dist'
        })
      }, {
        test: /\.(png|jpeg|jpg|gif)$/,
      //   include: path.join(__dirname, 'app/images/'),
        use: 'file-loader?name=images/[name].[ext]&context=app/images/'
      }, {
        test: /\.(woff|woff2|svg|eot|ttf)(\?.+)?$/i,
        use: 'file-loader?name=[name].[ext]'
      }]
    },


    plugins: [
      // new ManifestRevisionPlugin(path.join('assets/dist', 'manifest.json'), {
      //   rootAssetPath: './',
      //   ignorePaths: ['/stylesheets', '/javascript']
      // }),
      new CleanWebpackPlugin(pathsToClean, cleanOptions),
      new BundleTracker({path: __dirname, filename: './assets/dist/manifest.json'}),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['app']
      }),
      // new HtmlWebPackPlugin({
      //   template: 'index.html'
      // }),
      // new ExtractTextPlugin({
      //   filename: '[name].[hash].css',
      //   disable: false,
      //   allChunks: true
      // }),
      // new dotEnv({
      //   path: './.env',
      //   systemvars: true
      // }),
      // new DefinePlugin({
      //   'process.env': {
      //     NODE_ENV: '"production"'
      //   }
      // }),
      // new LoaderOptionsPlugin({
      //   options: {
      //     context: __dirname,
      //     // sassLoader: {
      //     //   includePaths: [path.resolve(__dirname, 'assets/sass')]
      //     // },
      //     postcss: [
      //         autoprefixer({
      //             browsers: [
      //                 'Android 2.3',
      //                 'Android >= 4',
      //                 'Chrome >= 20',
      //                 'Firefox >= 24', // Firefox 24 is the latest ESR
      //                 'Explorer >= 8',
      //                 'iOS >= 6',
      //                 'Opera >= 12',
      //                 'Safari >= 6'
      //             ],
      //             cascade: false
      //         }),
      //     ]
      //   }
      // })
    ],
    //   devServer: {
    //     contentBase: path.join(__dirname, 'dist'),
    //     port: 9000,
    //     inline: true,
    //     compress: true,
    //     stats: { colors: true },
    //     clientLogLevel: 'info'
    //   },
    //   watchOptions: {
    //     aggregateTimeout: 300,
    //     ignored: path.resolve(__dirname, 'node_modules/')
    //   },
    // devtool: 'source-map'
  }
  // console.log(isProd);

  if (isProd === 'false') {
    console.log('isDev');
    config['devtool'] = 'source-map';
    config['plugins'].push(
      new ExtractTextPlugin({
        filename: '[name].css',
        disable: false,
        allChunks: true
      })
    )
  }

  if (isProd === 'true') {
    console.log('isProd');
    config['output'] = {
      filename: '[name].[hash].bundle.js',
      path: path.join(__dirname, 'assets/dist')
    };
    config['plugins'].push(
      new ExtractTextPlugin({
        filename: '[name].[hash].css',
        disable: false,
        allChunks: true
      }),
      // new UglifyJsPlugin()
    )
  }

  


  return config

}