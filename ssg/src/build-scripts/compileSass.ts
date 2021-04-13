import fs from "fs-extra";
import path from "path";
import { render as renderSass } from "../utility/sassPromiseWrapper";

export async function compileSass({ from, to }: { from: string; to: string }) {
  try {
    console.log("Compiling Sass to CSS...");
    const { css } = await renderSass({ file: from });
    await fs.ensureDir(path.dirname(to));
    await fs.writeFile(to, css);
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
}
