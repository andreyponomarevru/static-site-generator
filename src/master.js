/* GLOBAL STYLES
 *
 * '_variables-mixins-and-functions.scss' contains global variables, mixins and functions.
 * It is already imported through webpack.config.js (in sass-loader options).
 * This file makes variables, mixins and functions declared within it available in all SCSS files of the project.
 *
 * 'blocks.common/html/_html.scss' contains the rest of global styles
 */

// BLOCKS ___________________________________________

// 'html' block provides global styles including CSS Reset
import './blocks.common/html/_html.scss';

// header
import './blocks.common/header/_header.scss';
import './blocks.common/header/header.js';

// logo
import './blocks.common/logo/_logo.scss';
import './blocks.common/logo/logo.js';

// section
import './blocks.common/section/_section.scss';
import './blocks.common/section/section.js';

// FAVICONS _________________________________________
import './favicon/favicon';
