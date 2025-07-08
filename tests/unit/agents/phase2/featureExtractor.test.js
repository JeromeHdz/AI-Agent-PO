const {
  extractFeatures,
} = require("../../../../src/agents/phase2/featureExtractor");

jest.mock("@langchain/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation(async (messages) => {
        // Récupère le contenu du message pour adapter la réponse
        const messageContent = messages[1].content;

        // Compte le nombre de lignes numérotées pour détecter le nombre de thèmes
        const numberedLines = messageContent.match(/\d+\./g) || [];

        // Si on a un seul thème (une seule ligne numérotée)
        if (numberedLines.length === 1) {
          return {
            content: `**Dark Mode**
Description: Users want a dark theme for better visual comfort
Objective: Improve night-time navigation experience and visual accessibility
Examples: Light/dark theme toggle in settings
Impact: high`,
          };
        }

        // Sinon, retourne 3 fonctionnalités (comportement par défaut)
        return {
          content: `**Dark Mode**
Description: Users want a dark theme for better visual comfort
Objective: Improve night-time navigation experience and visual accessibility
Examples: Light/dark theme toggle in settings
Impact: high

**Mobile Performance**
Description: App is considered slow on mobile devices
Objective: Reduce user frustration and increase retention
Examples: Optimize loading times and animations
Impact: high

**Interface Simplification**
Description: Interface is judged unintuitive for newcomers
Objective: Improve user onboarding and reduce support requests
Examples: Simplified navigation and clearer labels
Impact: moderate`,
        };
      }),
    })),
  };
});

describe("extractFeatures", () => {
  it("should extract features from thematic feedback lines", async () => {
    const themes = [
      "Users want a dark mode for better visual comfort",
      "App is slow on mobile devices",
      "Interface is confusing for new users",
    ];

    const result = await extractFeatures(themes);

    expect(result).toHaveLength(3);
    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].description).toBe(
      "Users want a dark theme for better visual comfort"
    );
    expect(result[0].objective).toBe(
      "Improve night-time navigation experience and visual accessibility"
    );
    expect(result[0].impact).toBe("high");

    expect(result[1].name).toBe("Mobile Performance");
    expect(result[1].description).toBe(
      "App is considered slow on mobile devices"
    );
    expect(result[1].impact).toBe("high");

    expect(result[2].name).toBe("Interface Simplification");
    expect(result[2].description).toBe(
      "Interface is judged unintuitive for newcomers"
    );
    expect(result[2].impact).toBe("moderate");
  });

  it("should return empty array for empty input", async () => {
    const result = await extractFeatures([]);
    expect(result).toEqual([]);
  });

  it("should handle single theme", async () => {
    const themes = ["Users want a dark mode"];

    const result = await extractFeatures(themes);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Dark Mode");
  });

  it("should handle unstructured response with new format", async () => {
    // Mock a different response format that uses the new dash format
    const { ChatOpenAI } = require("@langchain/openai");
    ChatOpenAI.mockImplementation(() => ({
      call: jest.fn().mockResolvedValue({
        content: `Here are the features I extracted:

- **Feature name**: Dark Mode
- **User description**: Users want dark theme for better visibility
- **Product objective / business value**: Improve user experience
- **Concrete usage examples**: Toggle switch in settings
- **Estimated impact on user experience**: High

- **Feature name**: Mobile Performance
- **User description**: App needs to be faster on mobile
- **Product objective / business value**: Improve mobile experience
- **Concrete usage examples**: Optimize loading times
- **Estimated impact on user experience**: High

These features address the main user concerns.`,
      }),
    }));

    const themes = [
      "Users want dark mode",
      "App is slow",
      "Interface is confusing",
    ];

    const result = await extractFeatures(themes);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].description).toBe("");
    expect(result[1].name).toBe("Mobile Performance");
    // The description might contain the last line of the response
    expect(result[1].description).toContain("These features address");
  });
});
