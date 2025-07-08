#!/usr/bin/env node

const { runPhase2Pipeline } = require("../agents/phase2/pipeline");
const path = require("path");

async function main() {
  try {
    const themesPath = path.join(__dirname, "../../outputs/themes.md");
    const markdownOutputPath = path.join(
      __dirname,
      "../../outputs/features.md"
    );
    const csvOutputPath = path.join(__dirname, "../../outputs/features.csv");

    console.log(
      "🎯 AI Agent Builder - Phase 2: Feature Extraction & Prioritization"
    );
    console.log(
      "=================================================================="
    );

    await runPhase2Pipeline(themesPath, markdownOutputPath, csvOutputPath);

    console.log("\n📁 Results saved to:");
    console.log(`  - Markdown: ${markdownOutputPath}`);
    console.log(`  - CSV: ${csvOutputPath}`);
  } catch (error) {
    console.error("❌ Pipeline failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
