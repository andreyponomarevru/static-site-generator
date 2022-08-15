import util from "util";

import { build } from "./build";

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    `UnhandledRejection: ${util.inspect(promise)}, reason "${reason}"`,
  );
});

build().catch(console.error);
