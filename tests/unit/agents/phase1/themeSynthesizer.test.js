const {
  summarizeBatch,
} = require("../../../../src/agents/phase1/themeSynthesizer");

jest.mock("langchain/chat_models/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation(async (messages) => {
        // Simule une réponse OpenAI avec une bullet list
        return {
          content: `- Users want a dark mode for better comfort at night.\n- Several users complain about slow performance on mobile.\n- Some find the interface confusing at first.`,
        };
      }),
    })),
  };
});

describe("summarizeBatch", () => {
  it("should parse bullet list from OpenAI response", async () => {
    const feedbacks = [
      "I want a dark mode!",
      "The app is too bright at night.",
      "It's slow on my phone.",
      "Mobile performance is bad.",
      "I don't understand the interface at first.",
    ];
    const result = await summarizeBatch(feedbacks);
    expect(result).toEqual([
      "Users want a dark mode for better comfort at night.",
      "Several users complain about slow performance on mobile.",
      "Some find the interface confusing at first.",
    ]);
  });

  it("should return empty array for empty input", async () => {
    const result = await summarizeBatch([]);
    expect(result).toEqual([]);
  });
});
