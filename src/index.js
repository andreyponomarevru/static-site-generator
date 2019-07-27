/*************
 * CSS RESET *
 *************/
import './_reset.scss';

/**********
 * BLOCKS *
 **********/

// link
import './blocks.common/link/_link.scss';
// section
import './blocks.common/section/_section.scss';
import './blocks.common/section/section.js';
//article
import './blocks.common/article/_article.scss';
// paragraph
import './blocks.common/paragraph/_paragraph.scss';
// image
import './blocks.common/image/_image.scss';
// heading
import './blocks.common/heading/_heading.scss';

// page-header
import './blocks.common/page-header/_page-header.scss';
import './blocks.common/page-header/page-header.js';
// page-main
import './blocks.common/page-main/_page-main.scss';
// page-footer
import './blocks.common/page-footer/_page-footer.scss';
// page
import './blocks.common/page/_page.scss';
import './blocks.common/page/page.js';

/************
 * GRAPHICS *
 ************/

function requireAllFiles(r) {
  r.keys().forEach(r);
}
// require favicons
requireAllFiles(
  require.context('./favicon/', true, /\.(svg|png|ico|xml|json)$/)
);
// require icons
requireAllFiles(require.context('./img/', true, /\.svg$/));
