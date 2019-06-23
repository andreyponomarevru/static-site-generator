# If any errors will arise try this settings

...
// UglifyJsPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  
  optimization: {
    minimize: false,
    minimizer: [ new UglifyJsPlugin( { uglifyOptions: { drop_console: false } } ) ]
  },


     
// ------------------------------------------------------------------------------------------------------

// Рабочий вариант 1
// С этими настройками и без sass-resourcres-loader работает но в общем бандлс.цсс кучу раз повторяется код файла _globals.scss
                 { loader: 'sass-loader', options: { sourceMap: true,
                                                     data: '@import "./scss/_globals.scss";',
                                                     includePaths: [__dirname, 'src'] } },
                                                     
// Раюлчий враиант 2
// Аналогично - с этими настройками и без sass-resourcres-loader работает но в общем бандлс.цсс кучу раз повторяется код файла _globals.scss
                 { loader: 'sass-loader' },
                 { loader: 'sass-resources-loader', options: { resources: './src/scss/_globals.scss' } },
...
