const path = require('path');

// Require Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PrettierPlugin = require("prettier-webpack-plugin"); // https://prettier.io/docs/en/options.html
const TerserPlugin = require('terser-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");


module.exports = {
  mode: 'development', 
  entry: { master: './src/index.js' },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name].[contenthash].js',
    publicPath: './',
  },
  watch: true,
  optimization: {
    minimize: false,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: { compress: { drop_console: true } }
      }),
      
      new TerserPlugin({
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },

  devServer: {
    overlay: true,
    publicPath: '/',
    contentBase: './dist',
  },
  
  module: {
  
    rules: [
    
        {
          test: /\.svg$/,
          loader: 'svg-url-loader',
          options: {
            noquotes: true,
          }, 
        },

        
        { // SCSS LOADER _____________________________________________________________________
          test: /\.(sa|sc|c)ss$/,///\.scss$/,
          use: [  
                 { loader: MiniCssExtractPlugin.loader },
                 { loader: 'css-loader', options: { sourceMap: true } },
                 // each loader, including css-nano applies to every SCSS file individualy, this is the reason why
                 // css nano doesnt merge and optimize duplicated code from different SCSS files. Should be fixed
                 // https://stackoverflow.com/questions/52564625/cssnano-doesnt-remove-duplicates
                 { loader: 'postcss-loader', 
                   options: { 
                     config: { path: __dirname + '/postcss.config.js' },
                   }, 
                 },
                 { loader: 'sass-loader', options: { sourceMap: true,
                                                     data: '@import "./_variables-mixins-and-functions.scss";',
                                                     includePaths: [__dirname, 'src'] } },
                                                         
          ],
        },    
        
        { // IMAGE LOADER https://webpack.js.org/loaders/file-loader/ ________________________
          test: /\.(jpe?g|png|gif|ico)$/,
          use: [ { loader: 'file-loader',
                   options: { name: '[name].[hash:8].[ext]',
                              context: 'src',
                              outputPath: (url, resourcePath, context) => {
                                // `resourcePath` is original absolute path to asset
                                // `context` is directory where stored asset (`rootContext`) or `context` option

                                // To get relative path you can use
                                // const relativePath = path.relative(context, resourcePath);
                                if (/favicon/.test(resourcePath)) return `favicon/${url}`;
                                /* if (/images/.test(context)) return `image_output_path/${url}`;*/
                                return `${url}`;
                              }
                   },
                } 
          ]
        },   
        

        { // HTML LOADER _____________________________________________________________________
          test: /\.pug$/, // /\.(html)$/,
          use: [ { loader: 'html-loader' }, 
                 { loader: 'pug-html-loader',
                   options: { "pretty": true } } ] 
        },         
        
        { // FONT LOADER _____________________________________________________________________
          test: /\.(woff|woff2|eot|ttf)$/, 
          use: [ { loader: 'url-loader',
                   options: { limit: 5000 } } ]
        }, 
        
        { // JS LOADER (BABEL) _______________________________________________________________
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: { loader: 'babel-loader',
                 options: { presets: ['@babel/preset-env'] } }
       },

    ]
    
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    
    new HtmlWebpackPlugin({ 
      inject: true,
      hash: false,
      filename: 'index.html', 
      template: './src/pug/index.pug',
      minify: { 
        removeComments: true, 
        collapseWhitespace: false,
      },           
    }),
  
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
                                 
    new MiniCssExtractPlugin({ 
      filename: 'master.[contenthash].css',

    }),
    
    new PrettierPlugin({ 
      printWidth: 80,
      tabWidth: 2,        
      useTabs: false,        
      semi: true,            
      trailingComma: 'es5',
      bracketSpacing: true,
    }), 
  ]
  
};  
   
