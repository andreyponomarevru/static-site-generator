// BLOCKS ___________________________________________

// 'html' block provides global styles including CSS Reset
import './blocks.common/html/_html.scss';

// logo
import './blocks.common/logo/logo';
import './blocks.common/logo/logo.js';

// section
import './blocks.common/section/section';
import './blocks.common/section/section.js';

/* GLOBAL STYLES
 *
 * '_variables-mixins-and-functions.scss' is already imported through webpack.config.js (in sass-loader options).
 * This file makes variables, mixins and functions available in all SCSS files of the project.
 *
 * 'blocks.common/html/_html.scss' contains the rest of global styles
 */

// FAVICONS _________________________________________
import './favicon/favicon';
