#!/usr/bin/env node

const { runPhase3Pipeline } = require("../agents/phase3/pipeline");
const path = require("path");

/**
 * Phase 3 CLI: Feature to User Story Transformation
 * Usage: node src/cli/phase3.js [input-file] [output-dir]
 */
async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);

    // Check for help flag
    if (args.includes("--help") || args.includes("-h")) {
      console.log("🚀 Phase 3: Feature to User Story Transformation");
      console.log("=" * 50);
      console.log("");
      console.log("Usage: node src/cli/phase3.js [input-file] [output-dir]");
      console.log("");
      console.log("Arguments:");
      console.log(
        "  input-file    Path to Phase 2 features CSV file (default: outputs/features.csv)"
      );
      console.log("  output-dir    Output directory (default: outputs)");
      console.log("");
      console.log("Examples:");
      console.log("  node src/cli/phase3.js");
      console.log("  node src/cli/phase3.js outputs/features.csv");
      console.log("  node src/cli/phase3.js outputs/features.csv my-output");
      console.log("");
      console.log("This will:");
      console.log("  ✅ Load features from Phase 2");
      console.log("  📝 Generate comprehensive user stories");
      console.log("  💾 Export results as CSV and Markdown");
      console.log("  📊 Generate summary statistics");
      console.log("");
      process.exit(0);
    }

    // Use default values if no arguments provided
    const inputFile = args[0] || "outputs/features.csv";
    const outputDir = args[1] || "outputs";

    // Validate input file
    if (!inputFile) {
      throw new Error("Input file is required");
    }

    const fs = require("fs");
    if (!fs.existsSync(inputFile)) {
      throw new Error(`Input file not found: ${inputFile}`);
    }

    // Check if input file is a CSV
    if (!inputFile.toLowerCase().endsWith(".csv")) {
      console.warn("⚠️  Warning: Input file doesn't have .csv extension");
    }

    console.log("🚀 Phase 3: Feature to User Story Transformation");
    console.log("=" * 50);
    console.log(`📁 Input file: ${inputFile}`);
    console.log(`📁 Output directory: ${outputDir}`);
    console.log("");

    // Run the pipeline
    const result = await runPhase3Pipeline(inputFile, outputDir);

    console.log("");
    console.log("🎉 Phase 3 completed successfully!");
    console.log("");
    console.log("📊 Results:");
    console.log(`  📄 CSV: ${result.csvPath}`);
    console.log(`  📝 Markdown: ${result.markdownPath}`);
    console.log("");
    console.log("📈 Summary:");
    console.log(result.summary);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("");
    console.error("For help, run: node src/cli/phase3.js");
    process.exit(1);
  }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
