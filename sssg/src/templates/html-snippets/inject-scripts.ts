export function injectScripts(scripts: string[]) {
  return scripts.length
    ? scripts.map((value) => `<script src="${value}"></script>`).join("")
    : "";
}
