/** To import SVGs:
 * 1. In Figma, select one of the icons inside the Icons container and select them with CTRL+A (or ⌘+A on Mac). Export them with the SVG type.
 * 2. Unzip the downloaded file, and copy the SVGs into the \`src/icons\` directory.
 * 3. Run this script
 **/

import fs from "fs/promises";
import path from "path";

const currentDir = import.meta.dirname;
const iconsDir = path.join(currentDir, "../src/icons");

const svgs = await fs.readdir(iconsDir);
await Promise.all(
  svgs
    .filter((svg) => svg.endsWith(".svg"))
    .map(async (svg) => {
      const svgContent = await fs.readFile(path.join(iconsDir, svg), "utf8");
      const result = svgContent
        .replace(/stroke="#160F1F"/g, 'stroke="currentColor"')
        .replace(/fill="#160F1F"/g, 'fill="currentColor"')
        .replace(/width="24"/g, 'width="100%"')
        .replace(/height="24"/g, 'height="100%"');
      await fs.writeFile(path.join(iconsDir, svg), result, "utf8");
    })
);

const iconNameMapping = {
  home: "Home",
  "link-discord": "LinkDiscord",
  "link-github": "LinkGithub",
  "link-x-social": "LinkXSocial",
};

function getIconName(svg) {
  const result = svg.replace(".svg", "").replace("Type=", "");
  return iconNameMapping[result] ?? result;
}

const header = `/**\n * This file is auto-generated by the \`import-svgs.mjs\` script.\n */`;
const content = svgs
  .filter((svg) => svg.endsWith(".svg"))
  .map(
    (svg) => `export { default as ${getIconName(svg)} } from "./${svg}?react";`
  )
  .join("\n");

await fs.writeFile(
  path.join(iconsDir, "index.ts"),
  `${header}\n\n${content}\n`,
  "utf8"
);
