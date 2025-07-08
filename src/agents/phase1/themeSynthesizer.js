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

const systemPrompt = `You are a senior Product Owner in a B2B SaaS company. Your task is to analyze a batch of raw user feedbacks (from emails, tickets, comments, etc.).\n\nInstructions:\n- Group together feedbacks that express the same underlying intent, need, or recurring request, even if the wording is different.\n- For each group, write a single, clear, and concise sentence that summarizes the main idea or request.\n- If several feedbacks are unique or do not fit any group, summarize them individually.\n- Do not invent needs that are not present in the feedbacks.\n- Write your output as a bullet list, one line per group or unique feedback.\n- Use professional, business-oriented language.`;

/**
 * Summarizes a batch of feedbacks using OpenAI via LangChain.
 * @param {string[]} feedbacks - Array of feedback messages
 * @returns {Promise<string[]>} Array of summary lines (one per group)
 */
async function summarizeBatch(feedbacks) {
  if (!Array.isArray(feedbacks) || feedbacks.length === 0) return [];
  const llm = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: OPENAI_MODEL,
    temperature: OPENAI_TEMPERATURE,
    maxTokens: OPENAI_MAX_TOKENS,
  });

  const humanPrompt = `Here is the batch of feedbacks to analyze:\n${feedbacks.map((f, i) => `- ${f}`).join("\n")}`;

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

module.exports = { summarizeBatch };
