const sass = require("node-sass");

//
// Promise wrapper
//

function render(config) {
  return new Promise((resolve, reject) => {
    sass.render(config, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

module.exports.render = render;
