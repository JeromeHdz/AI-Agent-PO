const fs = require("fs");
const csv = require("csv-parser");

/**
 * Reads a CSV file and returns an array of unique, non-empty messages.
 * @param {string} filePath - Path to the CSV file
 * @param {string} [column='message'] - Column name to extract
 * @returns {Promise<string[]>} Array of unique, non-empty messages
 */
async function readMessagesFromCSV(filePath, column = "message") {
  return new Promise((resolve, reject) => {
    const messagesSet = new Set();
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row[column]) {
          const msg = row[column].trim();
          if (msg) messagesSet.add(msg);
        }
      })
      .on("end", () => {
        resolve(Array.from(messagesSet));
      })
      .on("error", reject);
  });
}

module.exports = { readMessagesFromCSV };
