const {
  classifyWithKano,
  isValidKanoType,
} = require("../../../../src/agents/phase2/kanoPrioritizer");

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
            content: `Dark Mode | Must-have | Users expect dark theme as standard feature`,
          };
        }

        // Sinon, retourne la réponse complète (comportement par défaut)
        return {
          content: `Dark Mode | Must-have | Users expect dark theme as standard feature
Mobile Performance | Performance | Better performance leads to higher satisfaction
Interface Simplification | Performance | Simpler interface improves user satisfaction linearly
Notification Customization | Excitement | Unexpected feature that delights users`,
        };
      }),
    })),
  };
});

describe("classifyWithKano", () => {
  it("should classify features using Kano model", async () => {
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

    const result = await classifyWithKano(features);

    expect(result).toHaveLength(4);
    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].kano.type).toBe("must-have");
    expect(result[1].name).toBe("Mobile Performance");
    expect(result[1].kano.type).toBe("performance");
    expect(result[2].name).toBe("Interface Simplification");
    expect(result[2].kano.type).toBe("performance");
    expect(result[3].name).toBe("Notification Customization");
    expect(result[3].kano.type).toBe("excitement");
  });

  it("should return empty array for empty input", async () => {
    const result = await classifyWithKano([]);

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

    const result = await classifyWithKano(features);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Dark Mode");
    expect(result[0].kano.type).toBe("must-have");
    expect(result[0].kano.justification).toContain("Users expect dark theme");
  });

  it("should include Kano components in result", async () => {
    const features = [
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        impact: "high",
      },
    ];

    const result = await classifyWithKano(features);

    expect(result[0].kano).toHaveProperty("type");
    expect(result[0].kano).toHaveProperty("justification");
  });
});

describe("isValidKanoType", () => {
  it("should validate must-have type", () => {
    expect(isValidKanoType("must-have")).toBe(true);
  });

  it("should validate performance type", () => {
    expect(isValidKanoType("performance")).toBe(true);
  });

  it("should validate excitement type", () => {
    expect(isValidKanoType("excitement")).toBe(true);
  });

  it("should validate delighters type", () => {
    expect(isValidKanoType("delighters")).toBe(true);
  });

  it("should handle case insensitive validation", () => {
    expect(isValidKanoType("MUST-HAVE")).toBe(true);
    expect(isValidKanoType("Performance")).toBe(true);
  });

  it("should reject invalid types", () => {
    expect(isValidKanoType("invalid")).toBe(false);
    expect(isValidKanoType("")).toBe(false);
  });
});
