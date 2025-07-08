const {
  reduceSummaries,
} = require("../../../../src/agents/phase1/reduceSynthesizer");

jest.mock("langchain/chat_models/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation(async (messages) => {
        // Simule une réponse OpenAI avec une bullet list
        return {
          content: `- Users request a dark mode feature to enhance comfort during nighttime use.\n- There are concerns about slow performance on mobile devices.\n- The initial user interface is perceived as confusing by some users.\n- Notifications are viewed as excessively intrusive by users.`,
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

    // Verify we get the expected number of themes
    expect(result).toHaveLength(4);

    // Verify each theme contains relevant keywords
    expect(result[0]).toMatch(/dark mode|dark theme/i);
    expect(result[1]).toMatch(/performance|slow|mobile/i);
    expect(result[2]).toMatch(/interface|confusing|confusion/i);
    expect(result[3]).toMatch(/notification|intrusive/i);

    // Verify all results are strings
    result.forEach((theme) => {
      expect(typeof theme).toBe("string");
      expect(theme.length).toBeGreaterThan(0);
    });
  });

  it("should return empty array for empty input", async () => {
    const result = await reduceSummaries([]);
    expect(result).toEqual([]);
  });
});
