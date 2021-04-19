import util from "util";

type Reason = {} | null | undefined;

export function onUnhandledRejection(reason: Reason, promise: Promise<any>) {
  console.error(
    `UnhandledRejection: ${util.inspect(promise)}, reason "${reason}"`,
  );
}
