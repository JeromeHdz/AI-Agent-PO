const { readThemesFromMarkdown } = require("../../utils/markdownReader");
const { extractFeatures } = require("./featureExtractor");
const { prioritizeWithMoSCoW } = require("./moscowPrioritizer");
const { prioritizeWithRICE } = require("./ricePrioritizer");
const { classifyWithKano } = require("./kanoPrioritizer");
const { exportFeatures } = require("./featureExporter");

/**
 * Complete Phase 2 pipeline: extracts features from themes and prioritizes them using multiple methods.
 * @param {string} themesPath - Path to the themes markdown file from Phase 1
 * @param {string} markdownOutputPath - Path for markdown output
 * @param {string} csvOutputPath - Path for CSV output
 * @returns {Promise<void>}
 */
async function runPhase2Pipeline(
  themesPath,
  markdownOutputPath,
  csvOutputPath
) {
  console.log(
    "🚀 Starting Phase 2: Feature Extraction & Prioritization Pipeline"
  );

  try {
    // Step 1: Read themes from Phase 1
    console.log("📖 Reading themes from:", themesPath);
    const themes = await readThemesFromMarkdown(themesPath);
    console.log(`✅ Read ${themes.length} themes from Phase 1`);

    if (themes.length === 0) {
      throw new Error("No themes found in the input file");
    }

    // Step 2: Extract features from themes
    console.log("🔍 Extracting features from themes...");
    const features = await extractFeatures(themes);
    console.log(`✅ Extracted ${features.length} features`);

    if (features.length === 0) {
      throw new Error("No features extracted from themes");
    }

    // Step 3: Prioritize with MoSCoW
    console.log("⚖️ Prioritizing with MoSCoW method...");
    const moscowResults = await prioritizeWithMoSCoW(features);
    console.log(`✅ MoSCoW prioritization completed`);

    // Step 4: Prioritize with RICE
    console.log("📊 Prioritizing with RICE method...");
    const riceResults = await prioritizeWithRICE(features);
    console.log(`✅ RICE prioritization completed`);

    // Step 5: Classify with Kano
    console.log("🎯 Classifying with Kano model...");
    const kanoResults = await classifyWithKano(features);
    console.log(`✅ Kano classification completed`);

    // Step 6: Combine all results
    const results = {
      features: features,
      moscow: moscowResults,
      rice: riceResults,
      kano: kanoResults,
      summary: {
        totalFeatures: features.length,
        moscowMust: moscowResults.must?.length || 0,
        moscowShould: moscowResults.should?.length || 0,
        moscowCould: moscowResults.could?.length || 0,
        moscowWont: moscowResults.wont?.length || 0,
        topRiceScore: riceResults[0]?.rice?.score || 0,
        kanoMustHave: kanoResults.filter((f) => f.kano?.type === "must-have")
          .length,
        kanoPerformance: kanoResults.filter(
          (f) => f.kano?.type === "performance"
        ).length,
        kanoExcitement: kanoResults.filter((f) => f.kano?.type === "excitement")
          .length,
      },
    };

    // Step 7: Export results
    console.log("📤 Exporting results...");
    await exportFeatures(results, markdownOutputPath, csvOutputPath);
    console.log(`✅ Exported to ${markdownOutputPath} and ${csvOutputPath}`);

    console.log("🎉 Phase 2 completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  - Input themes: ${themes.length}`);
    console.log(`  - Extracted features: ${features.length}`);
    console.log(`  - MoSCoW Must: ${results.summary.moscowMust}`);
    console.log(`  - MoSCoW Should: ${results.summary.moscowShould}`);
    console.log(`  - Top RICE score: ${results.summary.topRiceScore}`);
    console.log(`  - Kano Must-have: ${results.summary.kanoMustHave}`);
    console.log(`  - Kano Performance: ${results.summary.kanoPerformance}`);
    console.log(`  - Kano Excitement: ${results.summary.kanoExcitement}`);
  } catch (error) {
    console.error("❌ Error in Phase 2 pipeline:", error.message);
    throw error;
  }
}

module.exports = { runPhase2Pipeline };
