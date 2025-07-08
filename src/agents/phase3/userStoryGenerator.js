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

Your task is to transform features into comprehensive user stories following this exact template:

**TEMPLATE STRUCTURE:**
✅ Title / EPIC or Feature
✅ Summary (User Story: As a... I want... So that...)
✅ Estimation / Effort (Fibonacci: 1, 2, 3, 5, 8, 13, 21, 34)
✅ Description / Context (detailed context and background)
💡Mockups / Design resources (links to design files)
✅ Acceptance Criteria (+ Business Rules)
✅ Acceptance Tests (BDD: Given... And... When... Then...)
💡Tagging Plan (tags to create/modify/delete)
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

Respond in this exact format:
Feature Name | User Story | Story Points | Description | Acceptance Criteria | BDD Tests | Dependencies | Value | Priority | Epic

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
      const priority = feature.moscow || feature.priority || "Should";
      const epic = feature.epic?.name || "General";
      const riceScore = feature.rice?.score
        ? ` (RICE: ${feature.rice.score})`
        : "";
      const kanoType = feature.kano?.type
        ? ` (Kano: ${feature.kano.type})`
        : "";

      return `${i + 1}. **${feature.name}** - ${feature.description} (Priority: ${priority}, Epic: ${epic})${riceScore}${kanoType}`;
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

    // Parse the user stories
    const userStories = parseUserStories(response.content, features);

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
  const lines = response.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      !trimmedLine ||
      trimmedLine.includes("Feature Name") ||
      trimmedLine.includes("---")
    ) {
      continue;
    }

    // Parse table format: Feature Name | User Story | Story Points | Description | Acceptance Criteria | BDD Tests | Dependencies | Value | Priority | Epic
    const parts = trimmedLine.split("|").map((part) => part.trim());

    if (parts.length >= 6) {
      const featureName = parts[0];
      const userStory = parts[1] || "";
      const storyPoints = parseInt(parts[2]) || 0;
      const description = parts[3] || "";
      const acceptanceCriteria = parts[4] || "";
      const bddTests = parts[5] || "";
      const dependencies = parts[6] || "";
      const value = parseFloat(parts[7]) || 0;
      const priority = parts[8] || "Should";
      const epic = parts[9] || "General";

      // Find the original feature to merge data
      const originalFeature = features.find(
        (f) =>
          f.name.toLowerCase().includes(featureName.toLowerCase()) ||
          featureName.toLowerCase().includes(f.name.toLowerCase())
      );

      if (originalFeature) {
        stories.push({
          ...originalFeature,
          userStory: {
            title: featureName,
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
    }
  }

  return stories;
}

module.exports = { generateUserStories };
