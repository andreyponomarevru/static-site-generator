import sass, { Result } from "node-sass";

// Sass Promise wrapper
function render(config: { file: string }): Promise<Result> {
  return new Promise((resolve, reject) => {
    sass.render(config, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export { render };
