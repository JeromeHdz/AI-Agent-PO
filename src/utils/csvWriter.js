const fs = require("fs");
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
    header: [
      { id: "id", title: "ID" },
      { id: "theme", title: "Theme" },
    ],
  });

  const records = themes.map((theme, index) => ({
    id: index + 1,
    theme: theme,
  }));

  await csvWriter.writeRecords(records);
}

/**
 * Writes features with prioritization results to a CSV file.
 * @param {Object} results - Object containing features and prioritization results
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<void>}
 */
async function writeFeaturesToCSV(results, filePath) {
  if (!results || !results.features) {
    throw new TypeError("Results must contain features array");
  }

  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Feature Name" },
      { id: "description", title: "Description" },
      { id: "objective", title: "Objective" },
      { id: "examples", title: "Examples" },
      { id: "impact", title: "Impact" },
      { id: "moscow", title: "MoSCoW" },
      { id: "rice_reach", title: "RICE Reach" },
      { id: "rice_impact", title: "RICE Impact" },
      { id: "rice_confidence", title: "RICE Confidence" },
      { id: "rice_effort", title: "RICE Effort" },
      { id: "rice_score", title: "RICE Score" },
      { id: "rice_justification", title: "RICE Justification" },
      { id: "kano_type", title: "Kano Type" },
      { id: "kano_justification", title: "Kano Justification" },
    ],
  });

  const records = results.features.map((feature, index) => {
    // Find MoSCoW classification
    let moscow = "Not classified";
    if (results.moscow.must?.includes(feature.name)) moscow = "Must";
    else if (results.moscow.should?.includes(feature.name)) moscow = "Should";
    else if (results.moscow.could?.includes(feature.name)) moscow = "Could";
    else if (results.moscow.wont?.includes(feature.name)) moscow = "Won't";

    // Find RICE data
    const riceFeature = results.rice.find((f) => f.name === feature.name);
    const rice = riceFeature?.rice || {};

    // Find Kano data
    const kanoFeature = results.kano.find((f) => f.name === feature.name);
    const kano = kanoFeature?.kano || {};

    return {
      id: index + 1,
      name: feature.name,
      description: feature.description,
      objective: feature.objective,
      examples: feature.examples || "",
      impact: feature.impact,
      moscow: moscow,
      rice_reach: rice.reach || 0,
      rice_impact: rice.impact || 0,
      rice_confidence: rice.confidence || 0,
      rice_effort: rice.effort || 0,
      rice_score: rice.score || 0,
      rice_justification: rice.justification || "",
      kano_type: kano.type || "",
      kano_justification: kano.justification || "",
    };
  });

  await csvWriter.writeRecords(records);
}

/**
 * Generic CSV writer function.
 * @param {string} filePath - Path to the CSV file
 * @param {Array} data - Array of objects to write
 * @returns {Promise<void>}
 */
async function writeCSV(filePath, data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TypeError("Data must be a non-empty array");
  }

  // Extract headers from the first object
  const headers = Object.keys(data[0]).map((key) => ({
    id: key,
    title:
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
  }));

  const csvWriter = createCsvWriter({
    path: filePath,
    header: headers,
  });

  await csvWriter.writeRecords(data);
}

module.exports = { writeThemesToCSV, writeFeaturesToCSV, writeCSV };
