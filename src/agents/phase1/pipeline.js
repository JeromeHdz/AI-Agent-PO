const { readMessagesFromCSV } = require("../../utils/csvReader");
const { chunkArray } = require("../../utils/chunkArray");
const { summarizeBatch } = require("./themeSynthesizer");
const { reduceSummaries } = require("./reduceSynthesizer");
const { exportThemes } = require("./themeExporter");

/**
 * Complete Phase 1 pipeline: reads feedbacks, processes them through Map-Reduce, and exports themes.
 * @param {string} inputPath - Path to the input CSV file
 * @param {string} markdownOutputPath - Path for markdown output
 * @param {string} csvOutputPath - Path for CSV output
 * @param {number} batchSize - Size of each batch (default: 20)
 * @returns {Promise<void>}
 */
async function runPhase1Pipeline(
  inputPath,
  markdownOutputPath,
  csvOutputPath,
  batchSize = 20
) {
  console.log("🚀 Starting Phase 1: Thematic Synthesis Pipeline");

  try {
    // Step 1: Read feedbacks
    console.log("📖 Reading feedbacks from:", inputPath);
    const messages = await readMessagesFromCSV(inputPath, "raw_text");
    console.log(`✅ Read ${messages.length} unique feedbacks`);

    if (messages.length === 0) {
      throw new Error("No feedbacks found in the input file");
    }

    // Step 2: Split into batches
    console.log(`✂️ Splitting into batches of ${batchSize}`);
    const batches = chunkArray(messages, batchSize);
    console.log(`✅ Created ${batches.length} batches`);

    // Step 3: Map phase - summarize each batch
    console.log("🧠 Processing batches (Map phase)...");
    const batchSummaries = [];
    for (let i = 0; i < batches.length; i++) {
      console.log(
        `  Processing batch ${i + 1}/${batches.length} (${batches[i].length} feedbacks)`
      );
      const summary = await summarizeBatch(batches[i]);
      batchSummaries.push(...summary);
    }
    console.log(`✅ Generated ${batchSummaries.length} intermediate summaries`);

    // Step 4: Reduce phase - merge similar summaries
    console.log("🔄 Merging summaries (Reduce phase)...");
    const finalThemes = await reduceSummaries(batchSummaries);
    console.log(`✅ Generated ${finalThemes.length} final themes`);

    // Step 5: Export results
    console.log("📤 Exporting results...");
    await exportThemes(finalThemes, markdownOutputPath, csvOutputPath);
    console.log(`✅ Exported to ${markdownOutputPath} and ${csvOutputPath}`);

    console.log("🎉 Phase 1 completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  - Input feedbacks: ${messages.length}`);
    console.log(`  - Batches processed: ${batches.length}`);
    console.log(`  - Intermediate summaries: ${batchSummaries.length}`);
    console.log(`  - Final themes: ${finalThemes.length}`);
  } catch (error) {
    console.error("❌ Error in Phase 1 pipeline:", error.message);
    throw error;
  }
}

module.exports = { runPhase1Pipeline };
