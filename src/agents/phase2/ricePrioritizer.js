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

const systemPrompt = `You are a senior Product Manager with expertise in RICE prioritization framework.

For each feature, assign a score according to these criteria:
- Reach (how many users are affected) /10
- Impact (effect on satisfaction/conversion/retention) /10  
- Confidence (your level of certainty) /10
- Effort (estimated from team perspective) /10

Then calculate the RICE score = (Reach × Impact × Confidence) / Effort.

Provide your response in this exact format:
Feature Name | Reach | Impact | Confidence | Effort | Score | Justification

Sort features from highest to lowest RICE score.
Add a brief written justification for each prioritization (1-2 sentences max).

Use realistic estimates based on the feature description and user feedback.`;

/**
 * Prioritizes features using the RICE method via OpenAI.
 * @param {Array} features - Array of extracted features
 * @returns {Promise<Array>} Array of features with RICE scores, sorted by priority
 */
async function prioritizeWithRICE(features) {
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

  const humanPrompt = `Here are the features to prioritize using RICE:

${featuresList}

Please calculate RICE scores for each feature and provide justification.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  try {
    const response = await llm.call(messages);

    // Parse the RICE response
    const riceResults = parseRICEResponse(response.content, features);

    return riceResults;
  } catch (error) {
    console.error("❌ Error in RICE prioritization:", error.message);
    throw error;
  }
}

/**
 * Parses the LLM response to extract RICE scores.
 * @param {string} response - Raw response from OpenAI
 * @param {Array} features - Original features array
 * @returns {Array} Array of features with RICE scores
 */
function parseRICEResponse(response, features) {
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

    // Parse table format: Feature | Reach | Impact | Confidence | Effort | Score | Justification
    const parts = trimmedLine.split("|").map((part) => part.trim());

    if (parts.length >= 6) {
      const featureName = parts[0];
      const reach = parseInt(parts[1]) || 0;
      const impact = parseInt(parts[2]) || 0;
      const confidence = parseInt(parts[3]) || 0;
      const effort = parseInt(parts[4]) || 1;
      const score = parseInt(parts[5]) || 0;
      const justification = parts[6] || "";

      // Find the original feature to merge data
      const originalFeature = features.find(
        (f) =>
          f.name.toLowerCase().includes(featureName.toLowerCase()) ||
          featureName.toLowerCase().includes(f.name.toLowerCase())
      );

      if (originalFeature) {
        results.push({
          ...originalFeature,
          rice: {
            reach,
            impact,
            confidence,
            effort,
            score,
            justification,
          },
        });
      }
    }
  }

  // Sort by RICE score (highest first)
  results.sort((a, b) => (b.rice?.score || 0) - (a.rice?.score || 0));

  return results;
}

/**
 * Calculates RICE score manually as backup.
 * @param {number} reach - Reach score (1-10)
 * @param {number} impact - Impact score (1-10)
 * @param {number} confidence - Confidence score (1-10)
 * @param {number} effort - Effort score (1-10)
 * @returns {number} RICE score
 */
function calculateRICEScore(reach, impact, confidence, effort) {
  if (effort === 0) return 0;
  return (reach * impact * confidence) / effort;
}

module.exports = { prioritizeWithRICE, calculateRICEScore };
