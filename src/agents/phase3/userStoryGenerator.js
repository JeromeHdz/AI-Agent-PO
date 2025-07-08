const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
require("dotenv").config();

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE) || 0.3;
const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS) || 4000;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const systemPrompt = `You are a senior Product Owner and Business Analyst with expertise in user story creation and agile development.

Your task is to transform features into comprehensive user stories following this exact template structure:

**TEMPLATE STRUCTURE:**
✅ Title / EPIC or Feature
✅ Summary (User Story: As a... I want... So that...)
✅ Estimation / Effort (Fibonacci: 1, 2, 3, 5, 8, 13, 21, 34)
✅ Description / Context (detailed context and background)
✅ Acceptance Criteria (+ Business Rules)
✅ Acceptance Tests (BDD: Given... And... When... Then...)
✅ Prerequisites or Dependencies (links to other user stories)
✅ Value / Priority (numerical value for Value/Effort ratio)

**User Story Format:**
As a [user type], I want [goal/feature], So that [benefit/value].

**Acceptance Criteria Format (BDD):**
Given [precondition]
And [additional precondition]
When [action/event]
Then [expected outcome]
And [additional outcome]

**Story Writing Guidelines:**
- Focus on user value and business outcomes
- Make stories INVEST-compliant (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- Include both functional and non-functional requirements
- Consider technical constraints and dependencies
- Align with epic objectives and business goals

**RESPONSE FORMAT:**
For each feature, respond with this exact structure:

**Feature Name:** [Feature Name]
**User Story:** As a [user type], I want [goal/feature], So that [benefit/value].
**Story Points:** [Fibonacci number: 1, 2, 3, 5, 8, 13, 21, 34]
**Description:** [Detailed context and background]
**Acceptance Criteria:** [List of acceptance criteria]
**BDD Tests:** [Given... And... When... Then... format]
**Dependencies:** [List of dependencies or "None"]
**Value:** [Numerical value 1-10]
**Priority:** [Must/Should/Could/Won't]
**Epic:** [Epic name]

Use clear, business-oriented English and focus on comprehensive story creation.`;

/**
 * Generates comprehensive user stories from features with detailed template.
 * @param {Array} features - Array of features with prioritization data
 * @returns {Promise<Array>} Array of comprehensive user stories
 */
async function generateUserStories(features) {
  if (!Array.isArray(features) || features.length === 0) {
    return [];
  }

  const llm = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: OPENAI_MODEL,
    temperature: OPENAI_TEMPERATURE,
    maxTokens: OPENAI_MAX_TOKENS,
  });

  const featuresList = features
    .map((feature, i) => {
      const priority = feature["MoSCoW"] || feature.moscow || "Should";
      const riceScore = feature["RICE Score"] || feature.rice?.score || "";
      const kanoType = feature["Kano Type"] || feature.kano?.type || "";

      return `${i + 1}. **${feature["Feature Name"]}** - ${feature["Description"]} (Priority: ${priority}, RICE: ${riceScore}, Kano: ${kanoType})`;
    })
    .join("\n");

  const humanPrompt = `Here are the features to transform into comprehensive user stories:

${featuresList}

Please create detailed user stories following the complete template structure. Focus on user value, business outcomes, and comprehensive acceptance criteria.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  try {
    const response = await llm.call(messages);

    // Debug: Log the AI response
    console.log("🔍 AI Response Preview:");
    console.log(response.content.substring(0, 500) + "...");
    console.log("");

    // Parse the user stories
    const userStories = parseUserStories(response.content, features);

    console.log(`📊 Parsed ${userStories.length} user stories`);
    return userStories;
  } catch (error) {
    console.error("❌ Error in user story generation:", error.message);
    throw error;
  }
}

/**
 * Parses the LLM response to extract comprehensive user stories.
 * @param {string} response - Raw response from OpenAI
 * @param {Array} features - Original features array
 * @returns {Array} Array of comprehensive user stories
 */
function parseUserStories(response, features) {
  const stories = [];

  // Split response into sections by feature (separated by ---)
  const sections = response.split(/\n---\n/);
  console.log(`🔍 Found ${sections.length} sections in response`);

  for (const section of sections) {
    if (!section.trim()) continue;

    console.log(`🔍 Processing section: ${section.substring(0, 100)}...`);

    // Extract feature name from the section
    let featureNameMatch = section.match(
      /\*\*Feature Name\*\*:\s*(.+?)(?:\n|$)/
    );
    if (!featureNameMatch) {
      // Try alternative regex with more flexible spacing
      featureNameMatch = section.match(/Feature Name.*?:\s*(.+?)(?:\n|$)/);
    }
    if (!featureNameMatch) {
      console.log(`❌ No Feature Name found in section`);
      continue;
    }

    const featureName = featureNameMatch[1].trim();
    console.log(`🔍 Processing feature: ${featureName}`);

    // Clean up feature name (remove extra **)
    const cleanFeatureName = featureName
      .replace(/^\*\*\s*/, "")
      .replace(/\s*\*\*$/, "");

    // Find the original feature
    const originalFeature = features.find(
      (f) =>
        f["Feature Name"]
          .toLowerCase()
          .includes(cleanFeatureName.toLowerCase()) ||
        cleanFeatureName.toLowerCase().includes(f["Feature Name"].toLowerCase())
    );

    if (!originalFeature) {
      console.log(
        `❌ Could not find original feature for: ${cleanFeatureName}`
      );
      continue;
    }

    console.log(
      `✅ Found original feature: ${originalFeature["Feature Name"]}`
    );

    // Extract user story - more flexible regex
    const userStoryMatch = section.match(/User Story.*?:\s*(.+?)(?:\n|$)/);
    const userStory = userStoryMatch ? userStoryMatch[1].trim() : "";

    // Extract story points - more flexible regex
    const storyPointsMatch = section.match(/Story Points.*?:\s*(\d+)/);
    const storyPoints = storyPointsMatch ? parseInt(storyPointsMatch[1]) : 8;

    // Extract description - more flexible regex
    const descriptionMatch = section.match(
      /Description.*?:\s*(.+?)(?=\*\*|$)/s
    );
    const description = descriptionMatch ? descriptionMatch[1].trim() : "";

    // Extract acceptance criteria - more flexible regex
    const acceptanceMatch = section.match(
      /Acceptance Criteria.*?:\s*(.+?)(?=\*\*|$)/s
    );
    const acceptanceCriteria = acceptanceMatch ? acceptanceMatch[1].trim() : "";

    // Extract BDD tests - more flexible regex
    const bddMatch = section.match(/BDD Tests.*?:\s*(.+?)(?=\*\*|$)/s);
    const bddTests = bddMatch ? bddMatch[1].trim() : "";

    // Extract dependencies - more flexible regex
    const dependenciesMatch = section.match(/Dependencies.*?:\s*(.+?)(?:\n|$)/);
    const dependencies = dependenciesMatch ? dependenciesMatch[1].trim() : "";

    // Extract value - more flexible regex
    const valueMatch = section.match(/Value.*?:\s*(\d+(?:\.\d+)?)/);
    const value = valueMatch ? parseFloat(valueMatch[1]) : 0;

    // Extract priority - more flexible regex
    const priorityMatch = section.match(/Priority.*?:\s*(.+?)(?:\n|$)/);
    const priority = priorityMatch
      ? priorityMatch[1].trim()
      : originalFeature["MoSCoW"] || "Should";

    // Extract epic - more flexible regex
    const epicMatch = section.match(/Epic.*?:\s*(.+?)(?:\n|$)/);
    const epic = epicMatch ? epicMatch[1].trim() : "General";

    // Debug: Log what we found
    console.log(`  📝 User Story: ${userStory.substring(0, 50)}...`);
    console.log(`  📊 Story Points: ${storyPoints}`);
    console.log(`  🎯 Priority: ${priority}`);
    console.log(`  📄 Description: ${description.substring(0, 30)}...`);
    console.log(
      `  ✅ Acceptance Criteria: ${acceptanceCriteria.substring(0, 30)}...`
    );

    stories.push({
      ...originalFeature,
      userStory: {
        title: cleanFeatureName,
        story: userStory,
        storyPoints,
        description,
        acceptanceCriteria,
        bddTests,
        dependencies,
        value,
        priority,
        epic,
        // Additional template fields
        mockups: "", // To be filled by design team
        taggingPlan: "", // To be filled by dev team
        performanceCriteria: "", // To be filled by tech team
        uiuxCriteria: "", // To be filled by design team
        dataCriteria: "", // To be filled by data team
      },
    });
  }

  return stories;
}

module.exports = { generateUserStories };
