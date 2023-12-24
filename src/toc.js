import GitHubSlugger from "github-slugger";

function getHeaders(markdownit, markdownRawData) {
  const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
  const ignoredTokens = new Set(["heading_open", "heading_close"]);
  let headingToken = null;
  const tokens = markdownit.parse(markdownRawData, {});
  const headings = [];

  for (const token of tokens) {
    if (headingTags.has(token.tag)) {
      if (token.type === "heading_open") headingToken = token.markup;
      else if (token.type === "heading_close") headingToken = null;
    }

    if (ignoredTokens.has(token.type)) continue;
    if (headingToken === null) continue;

    headings.push(
      `${headingToken} ${token.children.map((t) => t.content).join("")}`,
    );
  }
  headings.shift();
  return headings;
}

function buildTOC(headers) {
  let code = "";
  let prevHeaderLevel = 0;

  for (let i = 0; i < headers.length; i++) {
    const [_, hashSigns, headerText] = headers[i].match(/(^#{1,6}) (.*)/);
    const headerLevel = hashSigns.length;

    if (headerLevel === prevHeaderLevel) {
      code += `</li><li>${createHeaderLink(headerText)}`;
    } else if (headerLevel > prevHeaderLevel) {
      const a = headerLevel - prevHeaderLevel;
      for (let i = 0; i < a - 1; i++) code += "<ul><li>";
      code += `<ul><li>${createHeaderLink(headerText)}`;
    } else if (headerLevel < prevHeaderLevel) {
      const a = prevHeaderLevel - headerLevel;
      for (let i = 0; i < a; i++) code += "</li></ul>";
      code += `</li><li>${createHeaderLink(headerText)}`;
    }

    // If this is the last item in TOC
    if (i === headers.length - 1) code += "</li></ul>";

    prevHeaderLevel = headerLevel;
  }
  return code;
}

function createHeaderLink(headerText) {
  const slugger = new GitHubSlugger();
  return `<a href="#${slugger.slug(headerText)}">${headerText}</a>`;
}

export { getHeaders, buildTOC };
