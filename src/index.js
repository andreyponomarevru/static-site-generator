// css reset
import './_reset.scss';

// *** IMPORT BLOCKS ***

// link
import './blocks.common/link/_link.scss';
// heading
import './blocks.common/heading/_heading.scss';
// list
import './blocks.common/list/_list.scss';
// section
import './blocks.common/section/_section.scss';
import './blocks.common/section/section.js';
// paragraph
import './blocks.common/paragraph/_paragraph.scss';
// button
import './blocks.common/button/_button.scss';
// logo
import './blocks.common/logo/_logo.scss';
import './blocks.common/logo/logo.js';
// icon
import './blocks.common/icons/_icons.scss';
// horizontal rule
import './blocks.common/horizontal-rule/_horizontal-rule.scss';

// page
import './blocks.common/page/_page.scss';
import './blocks.common/page/page.js';
// page-header
import './blocks.common/page-header/_page-header.scss';
import './blocks.common/page-header/page-header.js';
// page-main
import './blocks.common/page-main/_page-main.scss';
// page-footer
import './blocks.common/page-footer/_page-footer.scss';

// IMPORT GRAPHICS
function requireAllFiles(r) {
  r.keys().forEach(r);
}
// require favicons
requireAllFiles(
  require.context('./favicon/', true, /\.(svg|png|ico|xml|json)$/)
);
// require icons
requireAllFiles(require.context('./img/', true, /\.svg$/));
