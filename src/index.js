/*
 * SCSS
 */

// To make `_global.scss` (global variables/mixins/...) available in all of
// our SCSS files, we inject it into each of them using `sass-resources-loader`
require("./blocks/_reset.scss");
require("./blocks/_main.scss");

/*
 * Images
 */

// To copy image files into output dir, require them (the rest is done by
// `file-loader`):
require("./img/002.jpg");
require("./img/003.png");
