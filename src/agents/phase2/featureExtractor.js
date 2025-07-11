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

const systemPrompt = `You are a senior Product Owner in a B2B SaaS scale-up, with solid experience in discovery, user feedback analysis, and roadmap management.

Your objective is to transform user feedback grouped by theme into actionable features for a product team.

For each feedback line, extract one or more functional specifications following this format:

- **Feature name** (short, actionable title)
- **User description**: what the user expresses or expects
- **Product objective / business value**: how this request is useful for the product or company
- **Concrete usage examples**: if relevant
- **Estimated impact on user experience**: low / moderate / high

Be concise, structured, and use business language.
Do not invent anything that is not present in the original feedback.

Format your response as a structured list with clear separations between features.`;

/**
 * Extracts features from thematic feedback lines using OpenAI via LangChain.
 * @param {string[]} themes - Array of thematic feedback lines from Phase 1
 * @returns {Promise<Array>} Array of extracted features with metadata
 */
async function extractFeatures(themes) {
  if (!Array.isArray(themes) || themes.length === 0) return [];

  const llm = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: OPENAI_MODEL,
    temperature: OPENAI_TEMPERATURE,
    maxTokens: OPENAI_MAX_TOKENS,
  });

  const humanPrompt = `Here are the thematic feedback lines to analyze and transform into features:

${themes.map((theme, i) => `${i + 1}. ${theme}`).join("\n")}

Please extract clear, actionable features from each theme. Focus on what users are actually asking for and what would provide business value.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  try {
    const response = await llm.call(messages);

    // Parse the structured response into features
    const features = parseFeaturesFromResponse(response.content);

    return features;
  } catch (error) {
    console.error("❌ Error in feature extraction:", error.message);
    throw error;
  }
}

/**
 * Parses the LLM response to extract structured features.
 * @param {string} response - Raw response from OpenAI
 * @returns {Array} Array of structured features
 */
function parseFeaturesFromResponse(response) {
  const features = [];
  const lines = response.split(/\r?\n/);

  let currentFeature = null;

  // Helper to push and reset
  function pushCurrent() {
    if (currentFeature) {
      features.push({
        name: currentFeature.name || "",
        description: currentFeature.description || "",
        objective: currentFeature.objective || "",
        examples: currentFeature.examples || "",
        impact: currentFeature.impact || "moderate",
      });
    }
    currentFeature = null;
  }

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // 1. Feature name (numbered or not)
    const numbered = trimmedLine.match(/^\d+\.\s*\*\*(.+?)\*\*/i);
    const plainNumbered = trimmedLine.match(/^\d+\.\s*(.+)$/i);
    const star = trimmedLine.match(/^\*\*(.+?)\*\*$/);
    if (numbered) {
      pushCurrent();
      currentFeature = {
        name: numbered[1].trim(),
        description: "",
        objective: "",
        examples: "",
        impact: "moderate",
      };
      continue;
    } else if (star) {
      pushCurrent();
      currentFeature = {
        name: star[1].trim(),
        description: "",
        objective: "",
        examples: "",
        impact: "moderate",
      };
      continue;
    } else if (plainNumbered) {
      pushCurrent();
      currentFeature = {
        name: plainNumbered[1].trim(),
        description: "",
        objective: "",
        examples: "",
        impact: "moderate",
      };
      continue;
    }

    // 2. Section lines (robust to format)
    // - **User description**: ...
    // - User description: ...
    // Description: ...
    // (idem pour les autres champs)
    const sectionMatch = trimmedLine.match(
      /^-?\s*\*?\*?\s*(User description|Description|Product objective \/ business value|Objective|Concrete usage examples|Examples|Estimated impact on user experience|Impact)\*?\*?\s*:?\s*(.*)$/i
    );
    if (sectionMatch && currentFeature) {
      const key = sectionMatch[1].toLowerCase();
      const value = sectionMatch[2].trim();
      if (key.includes("user description") || key === "description") {
        currentFeature.description = value;
      } else if (key.includes("objective") || key.includes("business value")) {
        currentFeature.objective = value;
      } else if (key.includes("example")) {
        currentFeature.examples = value;
      } else if (key.includes("impact")) {
        currentFeature.impact = value.toLowerCase();
      }
      continue;
    }

    // 3. Fallback: if line is not a section and we have a current feature, treat as description if empty
    if (currentFeature && !currentFeature.description) {
      currentFeature.description = trimmedLine;
    }
  }
  pushCurrent();
  return features;
}

module.exports = { extractFeatures };
