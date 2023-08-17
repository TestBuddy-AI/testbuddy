const webfont = require("webfont");
const fs = require("fs");
const path = require("path");

const svgs = ["js.svg", "ts.svg", "python.svg"].map((name) =>
  path.join(__dirname, "..", "assets/languages", name)
);

async function generateFont() {
  try {
    const result = await webfont.webfont({
      files: svgs,
      formats: ["woff"],
      startUnicode: 0xe000,
      verbose: true,
      normalize: true,
      sort: false,
    });
    const dest = path.join(__dirname, "..", "theme", "vscode-10.woff");
    fs.writeFileSync(dest, result.woff, "binary");
    console.log(`Font created at ${dest}`);
  } catch (e) {
    console.error("Font creation failed.", e);
  }
}

generateFont();
