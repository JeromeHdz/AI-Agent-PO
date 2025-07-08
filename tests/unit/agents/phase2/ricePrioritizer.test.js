const {
  prioritizeWithRICE,
  calculateRICEScore,
} = require("../../../../src/agents/phase2/ricePrioritizer");

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
            content: `Dark Mode | 8 | 9 | 8 | 3 | 192 | High user demand and significant impact on user experience`,
          };
        }

        // Sinon, retourne la réponse complète (comportement par défaut)
        return {
          content: `Dark Mode | 8 | 9 | 8 | 3 | 192 | High user demand and significant impact on user experience
Mobile Performance | 9 | 8 | 7 | 4 | 126 | Critical for mobile user retention
Interface Simplification | 7 | 6 | 8 | 2 | 168 | Improves overall user experience
Notification Customization | 5 | 4 | 6 | 3 | 40 | Nice-to-have feature with moderate impact`,
        };
      }),
    })),
  };
});

describe("prioritizeWithRICE", () => {
  it("should prioritize features using RICE method", async () => {
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

    const result = await prioritizeWithRICE(features);

    expect(result).toHaveLength(4);
    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].rice.score).toBe(192);
    expect(result[1].name).toBe("Interface Simplification");
    expect(result[1].rice.score).toBe(168);
    expect(result[2].name).toBe("Mobile Performance");
    expect(result[2].rice.score).toBe(126);
    expect(result[3].name).toBe("Notification Customization");
    expect(result[3].rice.score).toBe(40);
  });

  it("should return empty array for empty input", async () => {
    const result = await prioritizeWithRICE([]);

    expect(result).toEqual([]);
  });

  it("should handle single feature", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        impact: "high",
      },
    ];

    const result = await prioritizeWithRICE(features);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].rice.score).toBe(192);
    expect(result[0].rice.reach).toBe(8);
    expect(result[0].rice.impact).toBe(9);
    expect(result[0].rice.confidence).toBe(8);
    expect(result[0].rice.effort).toBe(3);
  });

  it("should include RICE components in result", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        impact: "high",
      },
    ];

    const result = await prioritizeWithRICE(features);

    expect(result[0].rice).toHaveProperty("reach");
    expect(result[0].rice).toHaveProperty("impact");
    expect(result[0].rice).toHaveProperty("confidence");
    expect(result[0].rice).toHaveProperty("effort");
    expect(result[0].rice).toHaveProperty("score");
    expect(result[0].rice).toHaveProperty("justification");
  });
});

describe("calculateRICEScore", () => {
  it("should calculate RICE score correctly", () => {
    const score = calculateRICEScore(8, 9, 8, 3);
    expect(score).toBe(192);
  });

  it("should return 0 when effort is 0", () => {
    const score = calculateRICEScore(8, 9, 8, 0);
    expect(score).toBe(0);
  });

  it("should handle different RICE values", () => {
    const score = calculateRICEScore(5, 6, 7, 2);
    expect(score).toBe(105);
  });
});
