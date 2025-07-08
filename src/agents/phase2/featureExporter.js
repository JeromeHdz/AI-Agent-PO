const { writeFeaturesToMarkdown } = require("../../utils/markdownWriter");
const { writeFeaturesToCSV } = require("../../utils/csvWriter");

/**
 * Exports features with all prioritization methods to both markdown and CSV formats.
 * @param {Object} results - Object containing features and prioritization results
 * @param {string} markdownPath - Path to the markdown file
 * @param {string} csvPath - Path to the CSV file
 * @returns {Promise<void>}
 */
async function exportFeatures(results, markdownPath, csvPath) {
  if (!results || !results.features) {
    throw new TypeError("Results must contain features array");
  }

  // Write to both formats
  await Promise.all([
    writeFeaturesToMarkdown(results, markdownPath),
    writeFeaturesToCSV(results, csvPath),
  ]);
}

module.exports = { exportFeatures };
