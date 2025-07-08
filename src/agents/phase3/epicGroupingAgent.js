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

const systemPrompt = `You are a senior Product Owner with expertise in backlog management and epic organization.

Your task is to group features into logical EPICs based on:
- Original feedback themes from Phase 1
- Functional domains and business areas
- Technical dependencies and relationships
- User experience coherence

Common EPIC categories:
- "User Experience Enhancement" (UI/UX improvements, accessibility)
- "Performance & Stability" (app performance, crashes, loading times)
- "Security & Authentication" (security features, 2FA, SSO)
- "Mobile Experience" (mobile-specific features, app parity)
- "Data Management" (export, import, reporting, analytics)
- "Collaboration & Workflow" (team features, approvals, notifications)
- "Integration & API" (third-party integrations, API improvements)
- "Administration & Management" (user management, settings, admin tools)

For each feature, assign the most appropriate EPIC. Consider the feature's description, objective, and impact when making the assignment.

Respond in this exact format:
Feature Name | EPIC Name | Justification

Use clear, business-oriented language and focus on logical grouping.`;

/**
 * Groups features into logical EPICs using OpenAI.
 * @param {Array} features - Array of features from Phase 2
 * @param {Array} themes - Array of themes from Phase 1 (for context)
 * @returns {Promise<Array>} Array of features with EPIC assignments
 */
async function groupFeaturesIntoEpics(features, themes = []) {
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
    .map(
      (feature, i) =>
        `${i + 1}. **${feature.name}** - ${feature.description} (Impact: ${feature.impact})`
    )
    .join("\n");

  const themesContext =
    themes.length > 0
      ? `\n\nOriginal themes from Phase 1:\n${themes.map((theme, i) => `${i + 1}. ${theme}`).join("\n")}`
      : "";

  const humanPrompt = `Here are the features to group into EPICs:

${featuresList}${themesContext}

Please assign each feature to the most appropriate EPIC and provide justification for your decisions.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  try {
    const response = await llm.call(messages);

    // Parse the EPIC assignments
    const epicAssignments = parseEpicAssignments(response.content, features);

    return epicAssignments;
  } catch (error) {
    console.error("❌ Error in EPIC grouping:", error.message);
    throw error;
  }
}

/**
 * Parses the LLM response to extract EPIC assignments.
 * @param {string} response - Raw response from OpenAI
 * @param {Array} features - Original features array
 * @returns {Array} Array of features with EPIC assignments
 */
function parseEpicAssignments(response, features) {
  const results = [];
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

    // Parse table format: Feature Name | EPIC Name | Justification
    const parts = trimmedLine.split("|").map((part) => part.trim());

    if (parts.length >= 3) {
      const featureName = parts[0];
      const epicName = parts[1];
      const justification = parts[2] || "";

      // Find the original feature to merge data
      const originalFeature = features.find(
        (f) =>
          f.name.toLowerCase().includes(featureName.toLowerCase()) ||
          featureName.toLowerCase().includes(f.name.toLowerCase())
      );

      if (originalFeature) {
        results.push({
          ...originalFeature,
          epic: {
            name: epicName,
            justification,
          },
        });
      }
    }
  }

  return results;
}

module.exports = { groupFeaturesIntoEpics };
