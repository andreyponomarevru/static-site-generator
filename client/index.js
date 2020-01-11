/*
 * HELPER FUNCTIONS
 */

// function for requiring images:
function requireFiles(r) {
  r.keys().forEach(r);
}

requireFiles(require.context("./src/doc/img/", true, /(svg|png|jpg)$/));

/*
 * CSS RESET
 */

import "./src/blocks/_reset.scss";

/*
 *  DOCUMENTATION STYLES
 */

import "./src/doc/_doc.scss";
import "./src/doc/doc.js";

/*
 * BLOCKS
 */

/* To control the CSS cascade and inheritance while importing blocks into the project, all blocks divided into two main groups:

   1. **Parent blocks** (these blocks usually, although it's not obligatory, serve as parent containers for "Child blocks")
   2. **Child blocks** (usually, you don't put anything inside these blocks, except text. Being imported last, rules in these blocks may override rules declared earlier in "Parent blocks")

**Don't change the order of blocks!** Although, all blocks are self-sufficient and don't rely on cascade and inheritance, in some rare cases reordering of their imports may break minor details like link color or font-size, so to be safe try to maintain the current blocks' order. If you don't need a block in your bundle, comment it out, don't delete it from this file, you might need it in the future */

// Parent blocks

import "./src/blocks/page/_page.scss";
import "./src/blocks/page/page.js";

import "./src/blocks/header/_header.scss";

import "./src/blocks/main/_main.scss";

import "./src/blocks/footer/_footer.scss";

import "./src/blocks/text/_text.scss";

import "./src/blocks/heading/_heading.scss";

import "./src/blocks/btn/_btn.scss";

import "./src/blocks/link/_link.scss";
