import { onUnhandledRejection } from "./error-handlers";
import { build } from "./build";

process.on("unhandledRejection", onUnhandledRejection);

build().catch(console.error);
