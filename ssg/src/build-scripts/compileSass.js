const fs = require("fs-extra");
const path = require("path");
const sass = require("./../utility/sassPromiseWrapper.js");

async function compileSass({ from, to }) {
  try {
    console.log("Compiling Sass to CSS...");
    const { css } = await sass.render({ file: from });
    await fs.ensureDir(path.dirname(to));
    await fs.writeFile(to, css);
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
}

module.exports.compileSass = compileSass;
