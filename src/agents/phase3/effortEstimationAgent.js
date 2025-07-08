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

const systemPrompt = `You are a senior Product Owner with expertise in agile estimation and story point calculation.

Your task is to estimate effort in Fibonacci story points (1, 2, 3, 5, 8, 13, 21) for each feature based on:

**Estimation Rules:**
- **1 point**: Very simple (bug fix, small UI adjustment, text change)
- **2 points**: Simple (minor feature, small enhancement)
- **3 points**: Small feature (new UI component, simple integration)
- **5 points**: Medium feature (new functionality, API endpoint, moderate complexity)
- **8 points**: Complex feature (new module, significant integration, multiple components)
- **13 points**: Very complex (major refactoring, new system, multiple teams)
- **21 points**: Extremely complex (architectural change, major system overhaul)

**Consider these factors:**
- RICE Effort score (if available)
- Feature complexity and scope
- Technical dependencies
- Integration requirements
- User interface complexity
- Data processing requirements

Respond in this exact format:
Feature Name | Story Points | Justification

Use clear, business-oriented language and focus on realistic estimation.`;

/**
 * Estimates effort in Fibonacci story points for features using OpenAI.
 * @param {Array} features - Array of features with EPIC assignments
 * @returns {Promise<Array>} Array of features with effort estimates
 */
async function estimateEffort(features) {
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
      const riceInfo = feature.rice
        ? ` (RICE Effort: ${feature.rice.effort})`
        : "";
      return `${i + 1}. **${feature.name}** - ${feature.description} (Impact: ${feature.impact})${riceInfo}`;
    })
    .join("\n");

  const humanPrompt = `Here are the features to estimate effort for:

${featuresList}

Please estimate the effort in Fibonacci story points for each feature and provide justification for your decisions.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  try {
    const response = await llm.call(messages);

    // Parse the effort estimates
    const effortEstimates = parseEffortEstimates(response.content, features);

    return effortEstimates;
  } catch (error) {
    console.error("❌ Error in effort estimation:", error.message);
    throw error;
  }
}

/**
 * Parses the LLM response to extract effort estimates.
 * @param {string} response - Raw response from OpenAI
 * @param {Array} features - Original features array
 * @returns {Array} Array of features with effort estimates
 */
function parseEffortEstimates(response, features) {
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

    // Parse table format: Feature Name | Story Points | Justification
    const parts = trimmedLine.split("|").map((part) => part.trim());

    if (parts.length >= 3) {
      const featureName = parts[0];
      const storyPoints = parseInt(parts[1]) || 0;
      const justification = parts[2] || "";

      // Validate Fibonacci points
      const validPoints = [1, 2, 3, 5, 8, 13, 21];
      const validatedPoints = validPoints.includes(storyPoints)
        ? storyPoints
        : 3; // Default to 3 if invalid

      // Find the original feature to merge data
      const originalFeature = features.find(
        (f) =>
          f.name.toLowerCase().includes(featureName.toLowerCase()) ||
          featureName.toLowerCase().includes(f.name.toLowerCase())
      );

      if (originalFeature) {
        results.push({
          ...originalFeature,
          effort: {
            storyPoints: validatedPoints,
            justification,
          },
        });
      } else {
        // If no match found, create a new feature with effort data
        results.push({
          name: featureName,
          effort: {
            storyPoints: validatedPoints,
            justification,
          },
        });
      }
    }
  }

  return results;
}

module.exports = { estimateEffort };
