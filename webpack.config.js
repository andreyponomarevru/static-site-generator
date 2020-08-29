const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PrettierPlugin = require("prettier-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/*
 * Webpack Configuration
 */

function webpackConfig(env, options) {
  return {
    entry: {
      master: "./src/index.js",
    },
    devtool: "inline-source-map",
    output: {
      path: path.resolve(__dirname + "/dist"),
      filename: "scripts.[contenthash].js",
      publicPath: "./",
    },
    watch: true,
    optimization: { minimize: false, minimizer: [terserPlugin] },
    devServer: { overlay: true, publicPath: "/", contentBase: "./dist" },
    module: { rules: [sassLoaders, imageLoader] },
    plugins: [
      htmlWebpackPlugin,
      miniCssExtractPlugin,
      prettierPlugin,
      copyWebpackPlugin,
    ],
  };
}

/*
 * Loaders
 */

// copies image files into output dir
const imageLoader = {
  test: /\.(jpe?g|png|gif|ico|svg)$/,
  use: [
    {
      // Doc: https://webpack.js.org/loaders/file-loader/
      loader: "file-loader",
      options: {
        name: "[name].[ext]",
        context: "src",
        // If you want to use function in `outputPath`, you need to explicitly
        // require all files that you need in index.js
        outputPath: "img",
      },
    },
  ],
};

const sassLoaders = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    { loader: MiniCssExtractPlugin.loader },
    {
      loader: "css-loader",
      options: { sourceMap: true },
    },
    {
      loader: "postcss-loader",
      options: { config: { path: "./postcss.config.js" } },
    },
    // Doc: https://webpack.js.org/loaders/sass-loader/
    {
      loader: "sass-loader",
      options: { implementation: require("node-sass"), sourceMap: true },
    },
    // Doc: https://www.npmjs.com/package/sass-resources-loader
    {
      loader: "sass-resources-loader",
      options: { resources: "./src/blocks/_global.scss" },
    },
  ],
};

/*
 * Plugins
 */

// Doc: https://github.com/webpack-contrib/copy-webpack-plugin
const copyWebpackPlugin = new CopyWebpackPlugin({
  patterns: [{ from: "src/favicon", to: "." }],
});

// Minify JavaScript code
const terserPlugin = new TerserPlugin({
  sourceMap: true,
  terserOptions: {
    output: {
      comments: false,
    },
  },
});

// Aside from other things, automatically adds hashes to filenames in html
// files
// Doc: https://github.com/jantimon/html-webpack-plugin
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  inject: true,
  hash: false,
  filename: "index.html",
  // If you need to export more then one template, just create new instances
  // of `htmlWebpackPlugin`
  template: "./src/index.html",
  minify: {
    removeComments: true,
    collapseWhitespace: false,
  },
});

const prettierPlugin = new PrettierPlugin({
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  trailingComma: "es5",
  bracketSpacing: true,
});

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: "styles.[contenthash].css",
});

module.exports = webpackConfig;
