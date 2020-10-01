const fs = require("fs-extra");
const sass = require("node-sass");
const path = require("path");

// Sass Promise wrapper
function render(config) {
  return new Promise((resolve, reject) => {
    sass.render(config, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function formatISOstr(timestamp) {
  const dateStr = new Date(timestamp).toDateString();
  const str1 = dateStr.match(/\b[A-Za-z]{3,3}\b/g);
  const str2 = dateStr.match(/\b\d{1,2}\b/);
  const str3 = dateStr.match(/\b\d{4,4}\b/);
  const month = str1[1];
  const date = str2[0];
  const year = str3[0];

  const formatted = { date, month, year };
  return formatted;
}

function fileUrlToHeading(filePpath) {
  let heading = path.basename(filePpath).replace("-", " ").split(".md")[0];
  heading = heading[0].toUpperCase() + heading.slice(1);
  return heading;
}

function encodeToBase64(text) {
  return Buffer.from(text).toString("base64");
}

module.exports.render = render;
module.exports.formatISOstr = formatISOstr;
module.exports.fileUrlToHeading = fileUrlToHeading;
module.exports.encodeToBase64 = encodeToBase64;
