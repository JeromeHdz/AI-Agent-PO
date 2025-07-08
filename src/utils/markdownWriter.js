const fs = require("fs").promises;

/**
 * Writes themes to a markdown file.
 * @param {string[]} themes - Array of theme strings
 * @param {string} filePath - Path to the markdown file
 * @returns {Promise<void>}
 */
async function writeThemesToMarkdown(themes, filePath) {
  if (!Array.isArray(themes)) {
    throw new TypeError("Themes must be an array");
  }

  const markdownContent = `# Synthèse des retours utilisateurs

${themes.map((theme) => `- ${theme}`).join("\n")}

---
*Généré automatiquement par AI Agent Builder - Phase 1*
`;

  await fs.writeFile(filePath, markdownContent, "utf8");
}

module.exports = { writeThemesToMarkdown };
