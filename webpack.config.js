const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PrettierPlugin = require("prettier-webpack-plugin"); // https://github.com/hawkins/prettier-webpack-plugin , https://prettier.io/docs/en/options.html
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = {

  mode: 'development', 

  entry: {
    master: './src/master.js',
  },
  
  devtool: 'inline-source-map',
  
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name].[contenthash:8].js',
    publicPath: './',
  },
  
  watch: true,
  
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin(),
    ]
  },
  
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@img': path.resolve(__dirname, 'src/img'),
      '@': path.resolve(__dirname, 'src')
    }
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
          test: /\.scss$/,
          use: [ { loader: MiniCssExtractPlugin.loader },
                 { loader: 'css-loader', options: { sourceMap: true } },
                 { loader: 'postcss-loader' },
                 { loader: 'sass-loader', options: { sourceMap: true,
                                                     data: '@import "./_globals.scss";',
                                                     includePaths: [__dirname, 'src'] } },
                                                         
          ]
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
      template: './src/index.pug',
      minify: { 
        removeComments: true, 
        collapseWhitespace: false,
      },           
    }),
    
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
                         
    new MiniCssExtractPlugin({ 
      filename: 'master.[contenthash:8].css',
    }),
    
    new PrettierPlugin({ 
      printWidth: 80,
      tabWidth: 2,        
      useTabs: false,        
      semi: true,            
      trailingComma: 'es5' 
    }), 
  ]
  
};  
   
