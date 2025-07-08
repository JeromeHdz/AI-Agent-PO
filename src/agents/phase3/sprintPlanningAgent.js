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

const systemPrompt = `You are a senior Product Owner and Scrum Master with expertise in sprint planning and agile project management.

Your task is to organize features into sprints based on their effort estimates, priority, and dependencies.

**Sprint Planning Rules:**
- **Sprint Capacity**: 40 story points per sprint (standard 2-week sprint)
- **Priority Order**: Must (MoSCoW) > Should > Could > Won't
- **Effort Distribution**: Balance high and low effort items
- **Dependencies**: Consider technical and business dependencies
- **Risk Management**: Mix complex and simple features
- **Team Velocity**: Consider team capacity and velocity

**Sprint Organization Guidelines:**
- Start with highest priority features
- Balance effort across sprints
- Group related features together
- Consider technical dependencies
- Leave buffer for unexpected work

Respond in this exact format:
Sprint 1 | Feature Name | Story Points | Priority | Justification

Use clear, business-oriented language and focus on realistic sprint planning.`;

/**
 * Organizes features into sprints based on effort and priority.
 * @param {Array} features - Array of features with effort estimates
 * @param {number} sprintCapacity - Story points per sprint (default: 40)
 * @param {number} numberOfSprints - Number of sprints to plan (default: 4)
 * @returns {Promise<Array>} Array of sprints with organized features
 */
async function planSprints(features, sprintCapacity = 40, numberOfSprints = 4) {
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
      const effort = feature.effort?.storyPoints || 3;
      const riceScore = feature.rice?.score
        ? ` (RICE: ${feature.rice.score})`
        : "";
      return `${i + 1}. **${feature.name}** - ${feature.description} (Priority: ${priority}, Effort: ${effort} SP)${riceScore}`;
    })
    .join("\n");

  const humanPrompt = `Here are the features to organize into sprints:

${featuresList}

Sprint Capacity: ${sprintCapacity} story points
Number of Sprints: ${numberOfSprints}

Please organize these features into sprints based on their priority, effort, and dependencies.`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  try {
    const response = await llm.call(messages);

    // Parse the sprint planning
    const sprintPlan = parseSprintPlan(
      response.content,
      features,
      sprintCapacity
    );

    return sprintPlan;
  } catch (error) {
    console.error("❌ Error in sprint planning:", error.message);
    throw error;
  }
}

/**
 * Parses the LLM response to extract sprint organization.
 * @param {string} response - Raw response from OpenAI
 * @param {Array} features - Original features array
 * @param {number} sprintCapacity - Story points per sprint
 * @returns {Array} Array of sprints with organized features
 */
function parseSprintPlan(response, features, sprintCapacity) {
  const sprints = [];
  const lines = response.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      !trimmedLine ||
      (trimmedLine.includes("Sprint") &&
        trimmedLine.includes("Feature Name")) ||
      trimmedLine.includes("---")
    ) {
      continue;
    }

    // Parse table format: Sprint X | Feature Name | Story Points | Priority | Justification
    const parts = trimmedLine.split("|").map((part) => part.trim());

    if (parts.length >= 4) {
      const sprintMatch = parts[0].match(/Sprint (\d+)/i);
      const sprintNumber = sprintMatch ? parseInt(sprintMatch[1]) : 1;
      const featureName = parts[1];
      const storyPoints = parseInt(parts[2]) || 0;
      const priority = parts[3] || "Should";
      const justification = parts[4] || "";

      // Find the original feature to merge data
      const originalFeature = features.find(
        (f) =>
          f.name.toLowerCase().includes(featureName.toLowerCase()) ||
          featureName.toLowerCase().includes(f.name.toLowerCase())
      );

      if (originalFeature) {
        // Find or create sprint
        let sprint = sprints.find((s) => s.sprintNumber === sprintNumber);
        if (!sprint) {
          sprint = {
            sprintNumber,
            features: [],
            totalEffort: 0,
            remainingCapacity: sprintCapacity,
          };
          sprints.push(sprint);
        }

        // Add feature to sprint
        sprint.features.push({
          ...originalFeature,
          sprintAssignment: {
            sprintNumber,
            priority,
            justification,
          },
        });
        sprint.totalEffort += storyPoints;
        sprint.remainingCapacity = Math.max(
          0,
          sprintCapacity - sprint.totalEffort
        );
      }
    }
  }

  // Sort sprints by sprint number
  sprints.sort((a, b) => a.sprintNumber - b.sprintNumber);

  return sprints;
}

module.exports = { planSprints };
