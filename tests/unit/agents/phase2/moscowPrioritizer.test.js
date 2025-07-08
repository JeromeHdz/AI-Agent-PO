const {
  prioritizeWithMoSCoW,
} = require("../../../../src/agents/phase2/moscowPrioritizer");

jest.mock("@langchain/openai", () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockImplementation(async (messages) => {
        // Récupère le contenu du message pour adapter la réponse
        const messageContent = messages[1].content;

        // Compte le nombre de fonctionnalités dans le message
        const featureLines = messageContent.match(/\*\*.*?\*\*/g) || [];

        // Si on a une seule fonctionnalité
        if (featureLines.length === 1) {
          return {
            content: `- Must: Dark Mode

Justification: Dark mode is frequently requested and has high business impact.`,
          };
        }

        // Sinon, retourne la réponse complète (comportement par défaut)
        return {
          content: `- Must: Dark Mode, Mobile Performance
- Should: Interface Simplification
- Could: Notification Customization
- Won't: Advanced Analytics

Justification: Dark mode and mobile performance are frequently requested and have high business impact. Interface simplification is important but less critical. Notification customization is nice-to-have but not essential.`,
        };
      }),
    })),
  };
});

describe("prioritizeWithMoSCoW", () => {
  it("should prioritize features using MoSCoW method", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        impact: "high",
      },
      {
        name: "Mobile Performance",
        description: "App is slow on mobile",
        impact: "high",
      },
      {
        name: "Interface Simplification",
        description: "Interface is confusing",
        impact: "moderate",
      },
      {
        name: "Notification Customization",
        description: "Customize notifications",
        impact: "low",
      },
    ];

    const result = await prioritizeWithMoSCoW(features);

    expect(result.must).toContain("Dark Mode");
    expect(result.must).toContain("Mobile Performance");
    expect(result.should).toContain("Interface Simplification");
    expect(result.could).toContain("Notification Customization");
    expect(result.wont).toContain("Advanced Analytics"); // Le mock retourne cette valeur
    expect(result.justification).toContain("Dark mode and mobile performance");
  });

  it("should return empty result for empty input", async () => {
    const result = await prioritizeWithMoSCoW([]);

    expect(result.must).toEqual([]);
    expect(result.should).toEqual([]);
    expect(result.could).toEqual([]);
    expect(result.wont).toEqual([]);
    expect(result.justification).toBe("No features to prioritize");
  });

  it("should handle single feature", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        impact: "high",
      },
    ];

    const result = await prioritizeWithMoSCoW(features);

    expect(result.must).toContain("Dark Mode");
    expect(result.should).toEqual([]);
    expect(result.could).toEqual([]);
    expect(result.wont).toEqual([]);
  });
});
