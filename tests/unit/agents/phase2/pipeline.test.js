const { runPhase2Pipeline } = require("../../../../src/agents/phase2/pipeline");
const {
  readThemesFromMarkdown,
} = require("../../../../src/utils/markdownReader");
const {
  extractFeatures,
} = require("../../../../src/agents/phase2/featureExtractor");
const {
  prioritizeWithMoSCoW,
} = require("../../../../src/agents/phase2/moscowPrioritizer");
const {
  prioritizeWithRICE,
} = require("../../../../src/agents/phase2/ricePrioritizer");
const {
  classifyWithKano,
} = require("../../../../src/agents/phase2/kanoPrioritizer");
const {
  exportFeatures,
} = require("../../../../src/agents/phase2/featureExporter");

// Mock all dependencies
jest.mock("../../../../src/utils/markdownReader");
jest.mock("../../../../src/agents/phase2/featureExtractor");
jest.mock("../../../../src/agents/phase2/moscowPrioritizer");
jest.mock("../../../../src/agents/phase2/ricePrioritizer");
jest.mock("../../../../src/agents/phase2/kanoPrioritizer");
jest.mock("../../../../src/agents/phase2/featureExporter");

describe("runPhase2Pipeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    readThemesFromMarkdown.mockResolvedValue([
      "Users want dark mode for better visibility",
      "Mobile app performance needs improvement",
      "Interface should be more intuitive",
    ]);

    extractFeatures.mockResolvedValue([
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        objective: "Improve user experience",
        examples: "Toggle switch, auto-detect",
        impact: "high",
      },
      {
        name: "Mobile Performance",
        description: "App is slow on mobile",
        objective: "Improve mobile experience",
        examples: "Faster loading, smoother animations",
        impact: "high",
      },
    ]);

    prioritizeWithMoSCoW.mockResolvedValue({
      must: ["Dark Mode"],
      should: ["Mobile Performance"],
      could: [],
      wont: [],
      justification: "Dark mode is essential for user experience",
    });

    prioritizeWithRICE.mockResolvedValue([
      {
        name: "Dark Mode",
        rice: {
          reach: 8,
          impact: 9,
          confidence: 8,
          effort: 3,
          score: 192,
          justification: "High user demand",
        },
      },
      {
        name: "Mobile Performance",
        rice: {
          reach: 9,
          impact: 8,
          confidence: 7,
          effort: 4,
          score: 126,
          justification: "Critical for mobile users",
        },
      },
    ]);

    classifyWithKano.mockResolvedValue([
      {
        name: "Dark Mode",
        kano: {
          type: "must-have",
          justification: "Users expect dark theme",
        },
      },
      {
        name: "Mobile Performance",
        kano: {
          type: "performance",
          justification: "Better performance improves satisfaction",
        },
      },
    ]);

    exportFeatures.mockResolvedValue();
  });

  it("should run complete Phase 2 pipeline successfully", async () => {
    const themesPath = "test-themes.md";
    const markdownOutputPath = "test-output.md";
    const csvOutputPath = "test-output.csv";

    await runPhase2Pipeline(themesPath, markdownOutputPath, csvOutputPath);

    // Verify all steps were called
    expect(readThemesFromMarkdown).toHaveBeenCalledWith(themesPath);
    expect(extractFeatures).toHaveBeenCalledWith([
      "Users want dark mode for better visibility",
      "Mobile app performance needs improvement",
      "Interface should be more intuitive",
    ]);
    expect(prioritizeWithMoSCoW).toHaveBeenCalledWith([
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        objective: "Improve user experience",
        examples: "Toggle switch, auto-detect",
        impact: "high",
      },
      {
        name: "Mobile Performance",
        description: "App is slow on mobile",
        objective: "Improve mobile experience",
        examples: "Faster loading, smoother animations",
        impact: "high",
      },
    ]);
    expect(prioritizeWithRICE).toHaveBeenCalledWith([
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        objective: "Improve user experience",
        examples: "Toggle switch, auto-detect",
        impact: "high",
      },
      {
        name: "Mobile Performance",
        description: "App is slow on mobile",
        objective: "Improve mobile experience",
        examples: "Faster loading, smoother animations",
        impact: "high",
      },
    ]);
    expect(classifyWithKano).toHaveBeenCalledWith([
      {
        name: "Dark Mode",
        description: "Users want dark theme",
        objective: "Improve user experience",
        examples: "Toggle switch, auto-detect",
        impact: "high",
      },
      {
        name: "Mobile Performance",
        description: "App is slow on mobile",
        objective: "Improve mobile experience",
        examples: "Faster loading, smoother animations",
        impact: "high",
      },
    ]);

    // Verify export was called with correct structure
    expect(exportFeatures).toHaveBeenCalledWith(
      expect.objectContaining({
        features: expect.arrayContaining([
          expect.objectContaining({ name: "Dark Mode" }),
          expect.objectContaining({ name: "Mobile Performance" }),
        ]),
        moscow: expect.objectContaining({
          must: ["Dark Mode"],
          should: ["Mobile Performance"],
        }),
        rice: expect.arrayContaining([
          expect.objectContaining({ name: "Dark Mode" }),
          expect.objectContaining({ name: "Mobile Performance" }),
        ]),
        kano: expect.arrayContaining([
          expect.objectContaining({ name: "Dark Mode" }),
          expect.objectContaining({ name: "Mobile Performance" }),
        ]),
        summary: expect.objectContaining({
          totalFeatures: 2,
          moscowMust: 1,
          moscowShould: 1,
          topRiceScore: 192,
          kanoMustHave: 1,
          kanoPerformance: 1,
          kanoExcitement: 0,
        }),
      }),
      markdownOutputPath,
      csvOutputPath
    );
  });

  it("should throw error when no themes found", async () => {
    readThemesFromMarkdown.mockResolvedValue([]);

    await expect(
      runPhase2Pipeline("empty-themes.md", "output.md", "output.csv")
    ).rejects.toThrow("No themes found in the input file");
  });

  it("should throw error when no features extracted", async () => {
    extractFeatures.mockResolvedValue([]);

    await expect(
      runPhase2Pipeline("themes.md", "output.md", "output.csv")
    ).rejects.toThrow("No features extracted from themes");
  });

  it("should handle errors from individual steps", async () => {
    const error = new Error("Feature extraction failed");
    extractFeatures.mockRejectedValue(error);

    await expect(
      runPhase2Pipeline("themes.md", "output.md", "output.csv")
    ).rejects.toThrow("Feature extraction failed");
  });
});
