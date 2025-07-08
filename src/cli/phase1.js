#!/usr/bin/env node

const { runPhase1Pipeline } = require("../agents/phase1/pipeline");
const path = require("path");

async function main() {
  try {
    const inputPath = path.join(__dirname, "../../data/feedback_raw.csv");
    const markdownOutputPath = path.join(__dirname, "../../outputs/themes.md");
    const csvOutputPath = path.join(__dirname, "../../outputs/themes.csv");

    console.log("🎯 AI Agent Builder - Phase 1: Thematic Synthesis");
    console.log("==================================================");

    await runPhase1Pipeline(inputPath, markdownOutputPath, csvOutputPath, 20);

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
