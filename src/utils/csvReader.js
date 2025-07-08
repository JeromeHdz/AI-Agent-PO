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

/**
 * Reads a CSV file and returns the data as an array of objects
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Array>} Array of objects representing CSV rows
 */
async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Convert empty strings to undefined for better handling
        const cleanData = {};
        Object.keys(data).forEach((key) => {
          cleanData[key] = data[key] === "" ? undefined : data[key];
        });
        results.push(cleanData);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = {
  readMessagesFromCSV,
  readCSV,
};
