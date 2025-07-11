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
      const featureName = feature["Feature Name"] || feature.name;
      const description = feature["Description"] || feature.description;
      const priority = feature["MoSCoW"] || feature.moscow || "Should";
      const riceScore = feature["RICE Score"] || feature.rice?.score || "";
      const kanoType = feature["Kano Type"] || feature.kano?.type || "";

      return `${i + 1}. **${featureName}** - ${description} (Priority: ${priority}, RICE: ${riceScore}, Kano: ${kanoType})`;
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

  // Split response into sections by feature (separated by --- or newlines)
  let sections = response.split(/\n---\n/);

  // If we have only one section but it contains multiple lines with pipes,
  // split by newlines to get individual features
  if (sections.length === 1 && sections[0].includes("\n")) {
    sections = sections[0]
      .split("\n")
      .filter((line) => line.trim() && line.includes("|"));
  }

  for (const section of sections) {
    if (!section.trim()) continue;

    // Try to parse as pipe-separated format first
    const parts = section.split("|").map((part) => part.trim());

    if (parts.length >= 3) {
      // Parse pipe-separated format: Feature | Story | Points | Description | Acceptance | BDD | Dependencies | Value | Priority | Epic
      const featureName = parts[0];
      const userStory = parts[1] || "";
      const storyPoints = parseInt(parts[2]) || 8;
      const description = parts[3] || "";
      const acceptanceCriteria = parts[4] || "";
      const bddTests = parts[5] || "";
      const dependencies = parts[6] || "";
      const value = parseFloat(parts[7]) || 0;
      const priority = parts[8] || "Should";
      const epic = parts[9] || "General";

      // Find the original feature - handle both "Feature Name" and "name" properties
      const originalFeature = features.find((f) => {
        const featureNameFromData = f["Feature Name"] || f.name;
        if (!featureNameFromData) return false;

        const match =
          featureNameFromData
            .toLowerCase()
            .includes(featureName.toLowerCase()) ||
          featureName.toLowerCase().includes(featureNameFromData.toLowerCase());

        return match;
      });

      if (!originalFeature) {
        continue;
      }

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
    } else {
      // Try to parse as section format with **Feature Name:** etc.
      const featureNameMatch = section.match(
        /\*\*Feature Name:\*\*\s*(.+?)(?:\n|$)/
      );
      if (!featureNameMatch) {
        console.log(`❌ No Feature Name found in section`);
        continue;
      }

      const featureName = featureNameMatch[1].trim();
      const userStoryMatch = section.match(
        /\*\*User Story:\*\*\s*(.+?)(?:\n|$)/
      );
      const storyPointsMatch = section.match(/\*\*Story Points:\*\*\s*(\d+)/);
      const descriptionMatch = section.match(
        /\*\*Description:\*\*\s*(.+?)(?:\n|$)/
      );
      const acceptanceMatch = section.match(
        /\*\*Acceptance Criteria:\*\*\s*(.+?)(?:\n|$)/
      );
      const bddMatch = section.match(/\*\*BDD Tests:\*\*\s*(.+?)(?:\n|$)/);
      const dependenciesMatch = section.match(
        /\*\*Dependencies:\*\*\s*(.+?)(?:\n|$)/
      );
      const valueMatch = section.match(/\*\*Value:\*\*\s*([\d.]+)/);
      const priorityMatch = section.match(/\*\*Priority:\*\*\s*(.+?)(?:\n|$)/);
      const epicMatch = section.match(/\*\*Epic:\*\*\s*(.+?)(?:\n|$)/);

      const userStory = userStoryMatch ? userStoryMatch[1].trim() : "";
      const storyPoints = storyPointsMatch ? parseInt(storyPointsMatch[1]) : 8;
      const description = descriptionMatch ? descriptionMatch[1].trim() : "";
      const acceptanceCriteria = acceptanceMatch
        ? acceptanceMatch[1].trim()
        : "";
      const bddTests = bddMatch ? bddMatch[1].trim() : "";
      const dependencies = dependenciesMatch ? dependenciesMatch[1].trim() : "";
      const value = valueMatch ? parseFloat(valueMatch[1]) : 0;
      const priority = priorityMatch ? priorityMatch[1].trim() : "Should";
      const epic = epicMatch ? epicMatch[1].trim() : "General";

      // Find the original feature - handle both "Feature Name" and "name" properties
      const originalFeature = features.find((f) => {
        const featureNameFromData = f["Feature Name"] || f.name;
        if (!featureNameFromData) return false;

        const match =
          featureNameFromData
            .toLowerCase()
            .includes(featureName.toLowerCase()) ||
          featureName.toLowerCase().includes(featureNameFromData.toLowerCase());

        return match;
      });

      if (!originalFeature) {
        continue;
      }

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

  return stories;
}

module.exports = { generateUserStories };
