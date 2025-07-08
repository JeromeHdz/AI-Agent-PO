const {
  reduceSummaries,
} = require("../../../../src/agents/phase1/reduceSynthesizer");

jest.mock("langchain/chat_models/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation(async (messages) => {
        // Simule une réponse OpenAI avec une bullet list
        return {
          content: `- Users want a dark mode for better comfort at night.\n- Several users complain about slow performance on mobile.\n- Some find the interface confusing at first.\n- Notifications are considered too intrusive.`,
        };
      }),
    })),
  };
});

describe("reduceSummaries", () => {
  it("should parse bullet list from OpenAI response and return all themes", async () => {
    const summaries = [
      "Users want a dark mode for better comfort at night.",
      "Several users complain about slow performance on mobile.",
      "Some find the interface confusing at first.",
      "Notifications are considered too intrusive.",
    ];
    const result = await reduceSummaries(summaries);
    expect(result).toEqual([
      "Users want a dark mode for better comfort at night.",
      "Several users complain about slow performance on mobile.",
      "Some find the interface confusing at first.",
      "Notifications are considered too intrusive.",
    ]);
  });

  it("should return empty array for empty input", async () => {
    const result = await reduceSummaries([]);
    expect(result).toEqual([]);
  });
});
