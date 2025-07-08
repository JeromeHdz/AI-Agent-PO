const {
  planSprints,
} = require("../../../../src/agents/phase3/sprintPlanningAgent");

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
              content: `Sprint 1 | Mobile Performance | 8 | Must | Critical performance optimization for mobile users.`,
            };
          }
          return {
            content: `Sprint 1 | Dark Mode | 3 | Must | High priority UI enhancement for user experience.`,
          };
        }

        // Otherwise, return the complete response (default behavior)
        return {
          content: `Sprint 1 | Dark Mode | 3 | Must | High priority UI enhancement for user experience.
Sprint 1 | Mobile Performance | 8 | Must | Critical performance optimization for mobile users.
Sprint 2 | Interface Simplification | 5 | Should | Medium priority UI refactoring for better usability.
Sprint 2 | Search Functionality | 13 | Should | Complex search implementation with multiple components.
Sprint 3 | Advanced Analytics | 21 | Could | Major feature requiring significant development effort.`,
        };
      }),
    })),
  };
});

describe("planSprints", () => {
  it("should organize features into sprints based on priority and effort", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
        moscow: "Must",
        effort: { storyPoints: 3, justification: "Simple UI enhancement" },
      },
      {
        name: "Mobile Performance",
        description: "App is slow on mobile devices",
        impact: "high",
        moscow: "Must",
        effort: { storyPoints: 8, justification: "Complex optimization" },
      },
      {
        name: "Interface Simplification",
        description: "Interface is confusing for newcomers",
        impact: "moderate",
        moscow: "Should",
        effort: { storyPoints: 5, justification: "UI refactoring" },
      },
    ];

    const result = await planSprints(features);

    expect(result).toHaveLength(2);
    expect(result[0].sprintNumber).toBe(1);
    expect(result[0].features).toHaveLength(2);
    expect(result[0].totalEffort).toBe(11); // 3 + 8
    expect(result[0].remainingCapacity).toBe(29); // 40 - 11
    expect(result[1].sprintNumber).toBe(2);
    expect(result[1].features).toHaveLength(1);
    expect(result[1].totalEffort).toBe(5);
    expect(result[1].remainingCapacity).toBe(35);
  });

  it("should return empty array for empty input", async () => {
    const result = await planSprints([]);

    expect(result).toEqual([]);
  });

  it("should handle single feature", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
        moscow: "Must",
        effort: { storyPoints: 3, justification: "Simple UI enhancement" },
      },
    ];

    const result = await planSprints(features);

    expect(result).toHaveLength(1);
    expect(result[0].sprintNumber).toBe(1);
    expect(result[0].features).toHaveLength(1);
    expect(result[0].totalEffort).toBe(3);
    expect(result[0].remainingCapacity).toBe(37);
  });

  it("should preserve original feature data", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        objective: "Improve user experience",
        examples: "Toggle switch in settings",
        impact: "high",
        moscow: "Must",
        effort: { storyPoints: 3, justification: "Simple UI enhancement" },
        epic: { name: "User Experience Enhancement" },
      },
    ];

    const result = await planSprints(features);

    expect(result[0].features[0].name).toBe("Dark Mode");
    expect(result[0].features[0].description).toBe(
      "Users want dark theme for visual comfort"
    );
    expect(result[0].features[0].objective).toBe("Improve user experience");
    expect(result[0].features[0].examples).toBe("Toggle switch in settings");
    expect(result[0].features[0].impact).toBe("high");
    expect(result[0].features[0].epic.name).toBe("User Experience Enhancement");
    expect(result[0].features[0].sprintAssignment).toBeDefined();
  });

  it("should handle custom sprint capacity", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
        moscow: "Must",
        effort: { storyPoints: 3, justification: "Simple UI enhancement" },
      },
    ];

    const result = await planSprints(features, 20); // Custom capacity

    expect(result[0].remainingCapacity).toBe(17); // 20 - 3
  });

  it("should handle features with RICE data", async () => {
    const features = [
      {
        name: "Mobile Performance",
        description: "App is slow on mobile devices",
        impact: "high",
        moscow: "Must",
        effort: { storyPoints: 8, justification: "Complex optimization" },
        rice: { score: 89.6, effort: 6 },
      },
    ];

    const result = await planSprints(features);

    expect(result[0].features[0].rice.score).toBe(89.6);
    expect(result[0].features[0].rice.effort).toBe(6);
    expect(result[0].features[0].sprintAssignment.priority).toBe("Must");
  });

  it("should sort sprints by sprint number", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
        moscow: "Must",
        effort: { storyPoints: 3, justification: "Simple UI enhancement" },
      },
      {
        name: "Interface Simplification",
        description: "Interface is confusing for newcomers",
        impact: "moderate",
        moscow: "Should",
        effort: { storyPoints: 5, justification: "UI refactoring" },
      },
    ];

    const result = await planSprints(features);

    // Verify sprints are sorted by sprint number
    for (let i = 1; i < result.length; i++) {
      expect(result[i].sprintNumber).toBeGreaterThan(
        result[i - 1].sprintNumber
      );
    }
  });

  it("should handle features without effort estimates", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
        moscow: "Must",
      },
    ];

    const result = await planSprints(features);

    expect(result).toHaveLength(1);
    expect(result[0].features[0].name).toBe("Dark Mode");
    // Should still have sprint assignment even without effort
    expect(result[0].features[0].sprintAssignment).toBeDefined();
  });
});
