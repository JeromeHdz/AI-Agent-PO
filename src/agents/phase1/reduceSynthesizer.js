const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
require("dotenv").config();

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE) || 0.3;
const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS) || 1000;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const systemPrompt = `You are a senior Product Owner in a B2B SaaS company. Your task is to analyze a list of user feedback summaries.\n\nInstructions:\n- Group together all summaries that express the same underlying theme or idea, even if the wording is different.\n- For each group, write a single, clear, and concise sentence that summarizes the main theme.\n- Do not invent new themes.\n- The number of themes should reflect the actual diversity of the input.\n- Write your output as a bullet list, one line per theme.\n- Use professional, business-oriented language.`;

/**
 * Reduces a list of summaries into global themes using OpenAI via LangChain.
 * @param {string[]} summaries - Array of summary lines
 * @returns {Promise<string[]>} Array of global theme lines
 */
async function reduceSummaries(summaries) {
  if (!Array.isArray(summaries) || summaries.length === 0) return [];
  const llm = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: OPENAI_MODEL,
    temperature: OPENAI_TEMPERATURE,
    maxTokens: OPENAI_MAX_TOKENS,
  });

  const humanPrompt = `Here is the list of user feedback summaries to analyze:\n${summaries.map((s, i) => `- ${s}`).join("\n")}`;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt),
  ];

  const response = await llm.call(messages);
  // Parse bullet list from response
  const lines = response.content
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter((line) => line.length > 0);
  return lines;
}

module.exports = { reduceSummaries };
