export function injectStylesheets(stylesheets: string[]) {
  return stylesheets.length
    ? stylesheets
        .map((value) => `<link rel="stylesheet" href="${value}">`)
        .join("")
    : "";
}
