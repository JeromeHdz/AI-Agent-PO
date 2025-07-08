const {
  groupFeaturesIntoEpics,
} = require("../../../../src/agents/phase3/epicGroupingAgent");

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
          return {
            content: `Dark Mode | User Experience Enhancement | This feature improves visual comfort and accessibility, aligning with UX enhancement goals.`,
          };
        }

        // Otherwise, return the complete response (default behavior)
        return {
          content: `Dark Mode | User Experience Enhancement | This feature improves visual comfort and accessibility, aligning with UX enhancement goals.
Mobile Performance | Performance & Stability | Critical for user retention and satisfaction, directly impacts app stability.
Interface Simplification | User Experience Enhancement | Improves usability and reduces cognitive load for users.`,
        };
      }),
    })),
  };
});

describe("groupFeaturesIntoEpics", () => {
  it("should group features into logical EPICs", async () => {
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
      },
      {
        name: "Interface Simplification",
        description: "Interface is confusing for newcomers",
        impact: "moderate",
      },
    ];

    const themes = [
      "Users frequently request dark mode for better visual comfort",
      "Mobile app performance issues reported by multiple users",
      "Interface complexity concerns from new users",
    ];

    const result = await groupFeaturesIntoEpics(features, themes);

    expect(result).toHaveLength(3);
    expect(result[0].epic.name).toBe("User Experience Enhancement");
    expect(result[0].epic.justification).toContain("visual comfort");
    expect(result[1].epic.name).toBe("Performance & Stability");
    expect(result[1].epic.justification).toContain("user retention");
    expect(result[2].epic.name).toBe("User Experience Enhancement");
    expect(result[2].epic.justification).toContain("usability");
  });

  it("should return empty array for empty input", async () => {
    const result = await groupFeaturesIntoEpics([]);

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

    const result = await groupFeaturesIntoEpics(features);

    expect(result).toHaveLength(1);
    expect(result[0].epic.name).toBe("User Experience Enhancement");
    expect(result[0].epic.justification).toContain("visual comfort");
  });

  it("should work without themes context", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        impact: "high",
      },
    ];

    const result = await groupFeaturesIntoEpics(features);

    expect(result).toHaveLength(1);
    expect(result[0].epic.name).toBe("User Experience Enhancement");
  });

  it("should preserve original feature data", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme for visual comfort",
        objective: "Improve user experience",
        examples: "Toggle switch in settings",
        impact: "high",
      },
    ];

    const result = await groupFeaturesIntoEpics(features);

    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].description).toBe(
      "Users want dark theme for visual comfort"
    );
    expect(result[0].objective).toBe("Improve user experience");
    expect(result[0].examples).toBe("Toggle switch in settings");
    expect(result[0].impact).toBe("high");
    expect(result[0].epic).toBeDefined();
  });
});
