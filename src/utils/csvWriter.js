const fs = require("fs").promises;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

/**
 * Writes themes to a CSV file.
 * @param {string[]} themes - Array of theme strings
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<void>}
 */
async function writeThemesToCSV(themes, filePath) {
  if (!Array.isArray(themes)) {
    throw new TypeError("Themes must be an array");
  }

  const csvWriter = createCsvWriter({
    path: filePath,
    header: [{ id: "theme", title: "theme" }],
  });

  const records = themes.map((theme) => ({ theme }));
  await csvWriter.writeRecords(records);
}

module.exports = { writeThemesToCSV };
