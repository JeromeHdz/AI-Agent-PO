const { generateUserStories } = require("./userStoryGenerator");
const { readCSV } = require("../../utils/csvReader");
const { writeCSV } = require("../../utils/csvWriter");
const { writeMarkdown } = require("../../utils/markdownWriter");
const path = require("path");

/**
 * Phase 3 Pipeline: Feature to User Story Transformation
 * Transforms prioritized features from Phase 2 into comprehensive user stories
 */
async function runPhase3Pipeline(inputFile, outputDir = "outputs") {
  console.log("🚀 Starting Phase 3: Feature to User Story Transformation");
  console.log("=".repeat(60));

  try {
    // Step 1: Load features from Phase 2
    console.log("📖 Loading features from Phase 2...");
    const features = await readCSV(inputFile);

    if (!features || features.length === 0) {
      throw new Error("No features found in input file");
    }

    console.log(`✅ Loaded ${features.length} features from Phase 2`);

    // Debug: Log first feature structure
    console.log("🔍 First feature structure:");
    console.log(JSON.stringify(features[0], null, 2));
    console.log("");

    // Step 2: Generate comprehensive user stories
    console.log("📝 Generating comprehensive user stories...");
    const userStories = await generateUserStories(features);

    if (!userStories || userStories.length === 0) {
      throw new Error("No user stories generated");
    }

    console.log(`✅ Generated ${userStories.length} user stories`);

    // Step 3: Prepare output data
    console.log("📊 Preparing output data...");
    const outputData = userStories.map((story) => ({
      title: story.userStory.title,
      userStory: story.userStory.story,
      storyPoints: story.userStory.storyPoints,
      description: story.userStory.description,
      acceptanceCriteria: story.userStory.acceptanceCriteria,
      bddTests: story.userStory.bddTests,
      dependencies: story.userStory.dependencies,
      value: story.userStory.value,
      priority: story.userStory.priority,
      epic: story.userStory.epic,
      // Original feature data
      originalDescription: story.description,
      impact: story.impact,
      moscow: story.moscow,
      riceScore: story.rice?.score || "",
      riceEffort: story.rice?.effort || "",
      kanoType: story.kano?.type || "",
      kanoScore: story.kano?.score || "",
    }));

    // Step 4: Export results
    console.log("💾 Exporting results...");

    // Create output directory if it doesn't exist
    const fs = require("fs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Export as CSV
    const csvOutputPath = path.join(outputDir, "user_stories.csv");

    // Define headers for user stories CSV
    const headers = [
      { id: "title", title: "Title" },
      { id: "userStory", title: "User Story" },
      { id: "storyPoints", title: "Story Points" },
      { id: "description", title: "Description" },
      { id: "acceptanceCriteria", title: "Acceptance Criteria" },
      { id: "bddTests", title: "BDD Tests" },
      { id: "dependencies", title: "Dependencies" },
      { id: "value", title: "Value" },
      { id: "priority", title: "Priority" },
      { id: "epic", title: "Epic" },
      { id: "originalDescription", title: "Original Description" },
      { id: "impact", title: "Impact" },
      { id: "moscow", title: "MoSCoW" },
      { id: "riceScore", title: "RICE Score" },
      { id: "riceEffort", title: "RICE Effort" },
      { id: "kanoType", title: "Kano Type" },
      { id: "kanoScore", title: "Kano Score" },
    ];

    await writeCSV(outputData, csvOutputPath, headers);
    console.log(`✅ User stories exported to: ${csvOutputPath}`);

    // Export as Markdown
    const markdownOutputPath = path.join(outputDir, "user_stories.md");
    await writeUserStoriesMarkdown(markdownOutputPath, userStories);
    console.log(`✅ User stories exported to: ${markdownOutputPath}`);

    // Step 5: Generate summary
    console.log("📈 Generating summary...");
    const summary = generateSummary(userStories);
    console.log(summary);

    console.log("🎉 Phase 3 completed successfully!");
    return {
      userStories,
      csvPath: csvOutputPath,
      markdownPath: markdownOutputPath,
      summary,
    };
  } catch (error) {
    console.error("❌ Error in Phase 3 pipeline:", error.message);
    throw error;
  }
}

/**
 * Writes user stories to markdown format with comprehensive template
 */
async function writeUserStoriesMarkdown(outputPath, userStories) {
  let markdown = "# User Stories\n\n";
  markdown += "Generated from Phase 2 features using AI-powered analysis.\n\n";

  userStories.forEach((story, index) => {
    markdown += `## ${index + 1}. ${story.userStory.title}\n\n`;

    // Template structure
    markdown += "### ✅ Summary\n";
    markdown += `**User Story:** ${story.userStory.story}\n\n`;

    markdown += "### ✅ Estimation / Effort\n";
    markdown += `**Story Points:** ${story.userStory.storyPoints} (Fibonacci)\n\n`;

    markdown += "### ✅ Description / Context\n";
    markdown += `${story.userStory.description}\n\n`;

    markdown += "### 💡 Mockups / Design Resources\n";
    markdown += "*To be filled by design team*\n\n";

    markdown += "### ✅ Acceptance Criteria\n";
    markdown += `${story.userStory.acceptanceCriteria}\n\n`;

    markdown += "### ✅ Acceptance Tests (BDD)\n";
    markdown += "```gherkin\n";
    markdown += `${story.userStory.bddTests}\n`;
    markdown += "```\n\n";

    markdown += "### 💡 Tagging Plan\n";
    markdown += "*To be filled by development team*\n\n";

    markdown += "### ✅ Prerequisites / Dependencies\n";
    markdown += `${story.userStory.dependencies}\n\n`;

    markdown += "### ✅ Value / Priority\n";
    markdown += `**Value:** ${story.userStory.value}\n`;
    markdown += `**Priority:** ${story.userStory.priority}\n`;
    markdown += `**Epic:** ${story.userStory.epic}\n\n`;

    // Additional template fields
    markdown += "### Performance Criteria\n";
    markdown += "*To be filled by technical team*\n\n";

    markdown += "### UI/UX Criteria\n";
    markdown += "*To be filled by design team*\n\n";

    markdown += "### Data Criteria\n";
    markdown += "*To be filled by data team*\n\n";

    markdown += "---\n\n";
  });

  // Write directly to file instead of using writeMarkdown
  const fs = require("fs").promises;
  await fs.writeFile(outputPath, markdown, "utf8");
}

/**
 * Generates a summary of the user stories
 */
function generateSummary(userStories) {
  const totalStories = userStories.length;
  const totalStoryPoints = userStories.reduce(
    (sum, story) => sum + story.userStory.storyPoints,
    0
  );
  const avgStoryPoints = totalStoryPoints / totalStories;

  const priorityCounts = userStories.reduce((counts, story) => {
    const priority = story.userStory.priority;
    counts[priority] = (counts[priority] || 0) + 1;
    return counts;
  }, {});

  const epicCounts = userStories.reduce((counts, story) => {
    const epic = story.userStory.epic;
    counts[epic] = (counts[epic] || 0) + 1;
    return counts;
  }, {});

  let summary = "\n📊 PHASE 3 SUMMARY\n";
  summary += "=".repeat(40) + "\n";
  summary += `Total User Stories: ${totalStories}\n`;
  summary += `Total Story Points: ${totalStoryPoints}\n`;
  summary += `Average Story Points: ${avgStoryPoints.toFixed(1)}\n\n`;

  summary += "Priority Distribution:\n";
  Object.entries(priorityCounts).forEach(([priority, count]) => {
    summary += `  ${priority}: ${count} stories\n`;
  });

  summary += "\nEpic Distribution:\n";
  Object.entries(epicCounts).forEach(([epic, count]) => {
    summary += `  ${epic}: ${count} stories\n`;
  });

  summary += "\n" + "=".repeat(40) + "\n";

  return summary;
}

module.exports = { runPhase3Pipeline };
