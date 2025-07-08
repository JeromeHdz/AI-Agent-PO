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

const systemPrompt = `You are a senior Product Manager with expertise in prioritization frameworks.

Your task is to classify the proposed features according to the MoSCoW method.

Consider these criteria:
- Frequency of expressed need
- Business value
- Implicit feasibility
- Effect on user experience

Respond in this format:
- Must: [feature1, feature2...]
- Should: [...]
- Could: [...]
- Won't: [...]

Add a brief written justification for each feature classification.

Use clear, business-oriented language and focus on what would have the most impact on user satisfaction and business goals.`;

/**
 * Prioritizes features using the MoSCoW method via OpenAI.
 * @param {Array} features - Array of extracted features
 * @returns {Promise<Object>} MoSCoW classification with justifications
 */
async function prioritizeWithMoSCoW(features) {
  if (!Array.isArray(features) || features.length === 0) {
    return {
      must: [],
      should: [],
      could: [],
      wont: [],
      justification: "No features to prioritize",
    };
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

  const humanPrompt = `Here are the features to prioritize using MoSCoW:

${featuresList}

Please classify each feature and provide justification for your decisions.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  try {
    const response = await llm.call(messages);

    // Parse the MoSCoW response
    const moscowResult = parseMoSCoWResponse(response.content, features);

    return moscowResult;
  } catch (error) {
    console.error("❌ Error in MoSCoW prioritization:", error.message);
    throw error;
  }
}

/**
 * Parses the LLM response to extract MoSCoW classification.
 * @param {string} response - Raw response from OpenAI
 * @param {Array} features - Original features array
 * @returns {Object} Structured MoSCoW result
 */
function parseMoSCoWResponse(response, features) {
  const result = {
    must: [],
    should: [],
    could: [],
    wont: [],
    justification: "",
  };

  const lines = response.split(/\r?\n/);
  let currentSection = null;
  let justification = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) continue;

    // Check for MoSCoW sections
    if (trimmedLine.toLowerCase().startsWith("- must:")) {
      currentSection = "must";
      const features = extractFeaturesFromLine(trimmedLine);
      result.must = features;
    } else if (trimmedLine.toLowerCase().startsWith("- should:")) {
      currentSection = "should";
      const features = extractFeaturesFromLine(trimmedLine);
      result.should = features;
    } else if (trimmedLine.toLowerCase().startsWith("- could:")) {
      currentSection = "could";
      const features = extractFeaturesFromLine(trimmedLine);
      result.could = features;
    } else if (
      trimmedLine.toLowerCase().startsWith("- won't:") ||
      trimmedLine.toLowerCase().startsWith("- wont:")
    ) {
      currentSection = "wont";
      const features = extractFeaturesFromLine(trimmedLine);
      result.wont = features;
    } else if (currentSection && trimmedLine.includes(":")) {
      // This might be justification
      justification.push(trimmedLine);
    }
  }

  result.justification = justification.join(" ");

  return result;
}

/**
 * Extracts feature names from a MoSCoW line.
 * @param {string} line - Line containing feature names
 * @returns {Array} Array of feature names
 */
function extractFeaturesFromLine(line) {
  // Remove the section prefix (e.g., "- Must:")
  const content = line.replace(/^-\s*(must|should|could|won't|wont):\s*/i, "");

  // Split by commas and clean up
  const features = content
    .split(",")
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0);

  return features;
}

module.exports = { prioritizeWithMoSCoW };
