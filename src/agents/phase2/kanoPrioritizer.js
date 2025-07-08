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

const systemPrompt = `You are a senior Product Manager with expertise in the Kano model for feature classification.

Classify each feature according to the Kano model categories:
- Must-have: Basic features that users expect as standard
- Performance: Features where more is better (linear satisfaction)
- Excitement: Unexpected features that create high satisfaction

Base your classification solely on the expressed feedback.

IMPORTANT: Respond EXACTLY in this format:
Feature Name | Kano Type | Justification

Example:
Dark Mode | Performance | Users want more customization options
App Stability | Must-have | Users expect basic reliability
AI Assistant | Excitement | Unexpected feature that delights users

Use clear, business-oriented language and focus on user satisfaction patterns.`;

/**
 * Classifies features using the Kano model via OpenAI.
 * @param {Array} features - Array of extracted features
 * @returns {Promise<Array>} Array of features with Kano classifications
 */
async function classifyWithKano(features) {
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

  const humanPrompt = `Here are the features to classify using the Kano model:

${featuresList}

Please classify each feature and provide justification for your decisions.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  try {
    const response = await llm.call(messages);

    // Parse the Kano response
    const kanoResults = parseKanoResponse(response.content, features);

    return kanoResults;
  } catch (error) {
    console.error("❌ Error in Kano classification:", error.message);
    throw error;
  }
}

/**
 * Parses the LLM response to extract Kano classifications.
 * @param {string} response - Raw response from OpenAI
 * @param {Array} features - Original features array
 * @returns {Array} Array of features with Kano classifications
 */
function parseKanoResponse(response, features) {
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

    // Parse table format: Feature Name | Kano Type | Justification
    const parts = trimmedLine.split("|").map((part) => part.trim());

    if (parts.length >= 3) {
      const featureName = parts[0];
      const kanoType = parts[1].toLowerCase();
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
          kano: {
            type: kanoType,
            justification,
          },
        });
      }
    }
  }

  return results;
}

/**
 * Validates Kano type classification.
 * @param {string} kanoType - The Kano type to validate
 * @returns {boolean} True if valid Kano type
 */
function isValidKanoType(kanoType) {
  const validTypes = ["must-have", "performance", "excitement", "delighters"];
  return validTypes.includes(kanoType.toLowerCase());
}

module.exports = { classifyWithKano, isValidKanoType };
