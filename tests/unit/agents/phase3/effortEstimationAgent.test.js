const {
  estimateEffort,
} = require("../../../../src/agents/phase3/effortEstimationAgent");

jest.mock("@langchain/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation(async (messages) => {
        // Get the message content to adapt the response
        const messageContent = messages[1].content;

        // Count the number of features in the message
        const featureLines = messageContent.match(/\*\*.*?\*\*/g) || [];

        // If we have a single feature
        if (featureLines.length === 1) {
          // Check if it's Mobile Performance (for RICE test)
          if (messageContent.includes("Mobile Performance")) {
            return {
              content: `Mobile Performance | 8 | Complex optimization requiring multiple system changes and testing.`,
            };
          }
          return {
            content: `Dark Mode | 3 | Simple UI enhancement with toggle functionality, moderate complexity.`,
          };
        }

        // Otherwise, return the complete response (default behavior)
        return {
          content: `Dark Mode | 3 | Simple UI enhancement with toggle functionality, moderate complexity.
Mobile Performance | 8 | Complex optimization requiring multiple system changes and testing.
Interface Simplification | 5 | Medium complexity involving UI refactoring and user testing.`,
        };
      }),
    })),
  };
});

describe("estimateEffort", () => {
  it("should estimate effort in Fibonacci story points", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
      },
      {
        name: "Mobile Performance",
        description: "App is slow on mobile devices",
        impact: "high",
        rice: { effort: 6 },
      },
      {
        name: "Interface Simplification",
        description: "Interface is confusing for newcomers",
        impact: "moderate",
      },
    ];

    const result = await estimateEffort(features);

    expect(result).toHaveLength(3);
    expect(result[0].effort.storyPoints).toBe(3);
    expect(result[0].effort.justification).toContain("UI enhancement");
    expect(result[1].effort.storyPoints).toBe(8);
    expect(result[1].effort.justification).toContain("optimization");
    expect(result[2].effort.storyPoints).toBe(5);
    expect(result[2].effort.justification).toContain("UI refactoring");
  });

  it("should return empty array for empty input", async () => {
    const result = await estimateEffort([]);

    expect(result).toEqual([]);
  });

  it("should handle single feature", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
      },
    ];

    const result = await estimateEffort(features);

    expect(result).toHaveLength(1);
    expect(result[0].effort.storyPoints).toBe(3);
    expect(result[0].effort.justification).toContain("UI enhancement");
  });

  it("should validate Fibonacci points", async () => {
    // Mock to return invalid points
    const mockLLM = require("@langchain/openai").ChatOpenAI;
    mockLLM.mockImplementationOnce(() => ({
      call: jest.fn().mockResolvedValue({
        content: `Dark Mode | 4 | Invalid Fibonacci point (should default to 3).`,
      }),
    }));

    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
      },
    ];

    const result = await estimateEffort(features);

    expect(result[0].effort.storyPoints).toBe(3); // Should default to 3 for invalid point
  });

  it("should preserve original feature data", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        objective: "Improve user experience",
        examples: "Toggle switch in settings",
        impact: "high",
        epic: { name: "User Experience Enhancement" },
      },
    ];

    const result = await estimateEffort(features);

    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].description).toBe(
      "Users want dark theme for visual comfort"
    );
    expect(result[0].objective).toBe("Improve user experience");
    expect(result[0].examples).toBe("Toggle switch in settings");
    expect(result[0].impact).toBe("high");
    expect(result[0].epic.name).toBe("User Experience Enhancement");
    expect(result[0].effort).toBeDefined();
  });

  it("should handle features with RICE data", async () => {
    const features = [
      {
        name: "Mobile Performance",
        description: "App is slow on mobile devices",
        impact: "high",
        rice: { effort: 6, score: 89.6 },
      },
    ];

    const result = await estimateEffort(features);

    expect(result[0].effort.storyPoints).toBe(8);
    expect(result[0].effort.justification).toContain("optimization");
  });
});
