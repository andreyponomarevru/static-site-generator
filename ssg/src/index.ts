import util from "util";
import { buildWebsite } from "./buildWebsite";

process.on("unhandledRejection", (reason, p) => {
  console.error(`UnhandledRejection: ${util.inspect(p)}, reason "${reason}"`);
});

buildWebsite().catch(console.error);
