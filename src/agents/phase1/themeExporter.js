const { writeThemesToMarkdown } = require("../../utils/markdownWriter");
const { writeThemesToCSV } = require("../../utils/csvWriter");

/**
 * Exports themes to both markdown and CSV formats.
 * @param {string[]} themes - Array of theme strings
 * @param {string} markdownPath - Path to the markdown file
 * @param {string} csvPath - Path to the CSV file
 * @returns {Promise<void>}
 */
async function exportThemes(themes, markdownPath, csvPath) {
  if (!Array.isArray(themes)) {
    throw new TypeError("Themes must be an array");
  }

  // Write to both formats
  await Promise.all([
    writeThemesToMarkdown(themes, markdownPath),
    writeThemesToCSV(themes, csvPath),
  ]);
}

module.exports = { exportThemes };
