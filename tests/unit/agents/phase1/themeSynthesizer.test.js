const {
  summarizeBatch,
} = require("../../../../src/agents/phase1/themeSynthesizer");

jest.mock("langchain/chat_models/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation(async (messages) => {
        // Simule une réponse OpenAI avec une bullet list
        return {
          content: `- Users are requesting a dark mode feature to improve usability in low-light conditions.\n- There are concerns about the application's slow performance on mobile devices.\n- The interface is initially confusing and requires improvements for better user understanding.`,
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

    // Verify we get the expected number of themes
    expect(result).toHaveLength(3);

    // Verify each theme contains relevant keywords
    expect(result[0]).toMatch(/dark mode|dark theme/i);
    expect(result[1]).toMatch(/performance|slow|mobile/i);
    expect(result[2]).toMatch(/interface|confusing|understand/i);

    // Verify all results are strings
    result.forEach((theme) => {
      expect(typeof theme).toBe("string");
      expect(theme.length).toBeGreaterThan(0);
    });
  });

  it("should return empty array for empty input", async () => {
    const result = await summarizeBatch([]);
    expect(result).toEqual([]);
  });
});
